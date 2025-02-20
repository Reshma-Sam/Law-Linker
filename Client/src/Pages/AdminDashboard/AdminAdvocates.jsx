import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import CustomAlert from "../../Components/CustomAlert";

const AdminAdvocates = ({ handleShowCreateAdvocateAdmin }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [advocates, setAdvocates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");

    // Function to show the custom alert
    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
    };

    // Fetch advocates from backend
    useEffect(() => {
        const fetchAdvocates = async () => {
            try {
                const response = await axios.get(`${apiUrl}/auth/advocates`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                console.log("API Response:", response.data); // Debugging

                if (response.data.advocates && Array.isArray(response.data.advocates)) {
                    setAdvocates(response.data.advocates); // Extract the advocates array
                } else {
                    triggerAlert("Unexpected API response format.");
                    setAdvocates([]);
                }
            } catch (error) {
                triggerAlert("Error fetching advocates.");
                setAdvocates([]);
            }
        };

        fetchAdvocates();
    }, []);

    // Multi-field search
    const filteredAdvocates = advocates.filter((advocate) => {
        const search = searchTerm.toLowerCase();
        return (
            advocate.firstname.toLowerCase().includes(search) ||
            advocate.lastname.toLowerCase().includes(search) ||
            advocate.email.toLowerCase().includes(search) ||
            advocate.specialization.toLowerCase().includes(search) ||
            advocate.state.toLowerCase().includes(search) ||
            advocate.district.toLowerCase().includes(search)
        );
    });

    // Navigate to Advocate Profile
    const handleViewProfile = (usertype, id) => {
        navigate(`/profile/other/${usertype}/${id}`);
    };

    // Delete Advocate
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not authorized. Please log in again.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this advocate?")) return;

        try {
            const response = await axios.delete(`${apiUrl}/auth/advocate/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                alert("Advocate deleted successfully!");
                setAdvocates((prev) => prev.filter((advocate) => advocate._id !== id));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete advocate");
        }
    };

    return (
        <div className="position-relative">
            <div className="top-center-alert">
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
            </div>

            <Container>
                <h2 className="text-center mt-4 mb-4">Advocate List</h2>

                <center>
                    <Button className="mb-4 AdminCreationButton" onClick={handleShowCreateAdvocateAdmin}>
                        Create Advocate
                    </Button>
                </center>

                {/* Search Bar */}
                <Form.Control
                    type="text"
                    placeholder="Search by name, email, specialization, state, or district..."
                    className="mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Row>
                    {filteredAdvocates.map((advocate) => (
                        <Col md={4} key={advocate._id} className="mb-3">
                            <Card className="shadow">
                                <Card.Img
                                    variant="top"
                                    src={advocate.profilePicture || "https://dummyimage.com/200"}
                                    alt="Profile"
                                    style={{ height: "150px", objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <Card.Title>{advocate.firstname} {advocate.lastname}</Card.Title>
                                    <Card.Subtitle>{advocate.usertype}</Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Specialization: {advocate.specialization}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        <strong>Email:</strong> {advocate.email} <br />
                                        <strong>Mobile:</strong> {advocate.mobile} <br />
                                        <strong>State:</strong> {advocate.state}, <strong>District:</strong> {advocate.district}
                                    </Card.Text>
                                    <Button className="loginButton" onClick={() => handleViewProfile(advocate.usertype, advocate._id)}>
                                        View Profile
                                    </Button>
                                    <Button variant="danger" className="ms-2" onClick={() => handleDelete(advocate._id)}>
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {filteredAdvocates.length === 0 && <p className="text-center mt-3">No advocates found.</p>}
            </Container>
        </div>
    );
};

export default AdminAdvocates;
