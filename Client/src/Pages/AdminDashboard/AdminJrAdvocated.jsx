import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import CustomAlert from "../../Components/CustomAlert";

const AdminJrAdvocates = ({ handleShowCreateJrAdvocateAdmin }) => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [jrAdvocates, setJrAdvocates] = useState([]);
    const navigate = useNavigate()
    const [alertMessage, setAlertMessage] = useState("");

    // Function to show the custom alert
    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
    };


    // Fetch Jr. Advocates from backend
    useEffect(() => {
        const fetchJrAdvocates = async () => {
            try {
                const response = await axios.get(`${apiUrl}/auth/jrAdvocates`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                console.log("API Response:", response.data); // Debugging

                if (response.data.jradvocates && Array.isArray(response.data.jradvocates)) {
                    setJrAdvocates(response.data.jradvocates); // Use correct property name
                } else {
                    triggerAlert("Unexpected API response format:", response.data);
                    setJrAdvocates([]);
                }

            } catch (error) {
                triggerAlert("Error fetching Jr. Advocates:", error);
                setJrAdvocates([]);
            }
        };

        fetchJrAdvocates();
    }, []);

    const handleViewProfile = (usertype, id) => {
        navigate(`/profile-advocate/${usertype}/${id}`);
    };

    // Delete Jr. Advocate
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No authentication token found");
            triggerAlert("You are not authorized. Please log in again.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this Jr. Advocate?")) return;

        try {
            const response = await axios.delete(`${apiUrl}/auth/JrAdvocate/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                triggerAlert("Jr. Advocate deleted successfully!");
                setJrAdvocates((prev) => prev.filter((jrAdvocate) => jrAdvocate._id !== id));
            }
        } catch (error) {
            triggerAlert("Error deleting Jr. Advocate:", error);
            alert(error.response?.data?.message || "Failed to delete Jr. Advocate");
        }
    };

    const BASE_URL = "http://localhost:5500"

    return (
        <div className="position-relative">
            <div className="top-center-alert">
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
            </div>
            <Container>
                <h2 className="text-center mt-4 mb-4">Jr. Advocate List</h2>
                <center>
                    <Button className="mb-5 AdminCreationButton" onClick={handleShowCreateJrAdvocateAdmin}>
                        Create Jr. Advocate
                    </Button>
                </center>

                <Row>
                    {jrAdvocates.map((jrAdvocate) => (
                        <Col md={4} key={jrAdvocate._id} className="mb-3">
                            <Card className="shadow">
                                <Card.Img
                                    variant="top"
                                    src={jrAdvocate.profilePicture ? `${BASE_URL}${jrAdvocate.profilePicture}` : "https://dummyimage.com/200"}
                                    alt="Profile"
                                    style={{ height: "150px", objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <Card.Title>{jrAdvocate.firstname} {jrAdvocate.lastname}</Card.Title>
                                    <Card.Subtitle>{jrAdvocate.usertype}</Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">Specialization: {jrAdvocate.specialization}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Email:</strong> {jrAdvocate.email} <br />
                                        <strong>Mobile:</strong> {jrAdvocate.mobile} <br />
                                        <strong>State:</strong> {jrAdvocate.state}, <strong>District:</strong> {jrAdvocate.district}
                                    </Card.Text>
                                    <Button className="loginButton" onClick={() => handleViewProfile(jrAdvocate.usertype, jrAdvocate._id)}>
                                        View Profile
                                    </Button>
                                    <Button variant="danger" className="ms-2" onClick={() => handleDelete(jrAdvocate._id)}>
                                        Delete
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default AdminJrAdvocates;
