import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap"
import CustomAlert from "../../Components/CustomAlert";

const AdminCases = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [cases, setCases] = useState([]);
    const [advocateFirstName, setAdvocateFirstName] = useState("");
    const [advocateLastName, setAdvocateLastName] = useState("");
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    // Function to show the custom alert
    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
    };

    // Fetch all cases on component mount
    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await axios.get(`${apiUrl}/auth/cases`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                console.log("Cases API Response:", response.data); // Debugging

                if (response.data.cases && Array.isArray(response.data.cases)) {
                    setCases(response.data.cases);
                } else {
                    console.error("Unexpected API response format:", response.data);
                    setCases([]);
                }
            } catch (error) {
                console.error("Error fetching cases:", error);
                setCases([]);
            }
        };

        fetchCases();
    }, []);

    //  Fetch cases by advocate's name
    const fetchCasesByAdvocate = async () => {
        if (!advocateFirstName.trim() || !advocateLastName.trim()) {
            triggerAlert("Please enter both first and last name.")
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            triggerAlert("No token found. Please log in again.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `${apiUrl}/auth/getAllCasesOfAdvocate?advocateFirstName=${advocateFirstName.trim()}&advocateLastName=${advocateLastName.trim()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setCases(response.data.cases);
                triggerAlert(`Cases retrieved for Adv. ${advocateFirstName} ${advocateLastName}`);
            } else {
                setCases([]);
                triggerAlert(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching cases by advocate:", error);
            triggerAlert(error.response?.data?.message || "Failed to fetch cases");
            setCases([]);
        }
        setLoading(false);
    };


    return (
        <div className="position-relative">
        <div className="top-center-alert">
            <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
            </div>
        <Container>
            <h2 className="text-center mt-4 mb-4">Cases List</h2>

            {/*  Search Cases by Advocate */}
            <Form className="mb-4 d-flex justify-content-center">
                <Form.Control
                    type="text"
                    placeholder="Advocate Name"
                    value={advocateFirstName}
                    onChange={(e) => setAdvocateFirstName(e.target.value)}
                    className="me-2"
                />
                <Form.Control
                    type="text"
                    placeholder="Advocate Name"
                    value={advocateLastName}
                    onChange={(e) => setAdvocateLastName(e.target.value)}
                    className="me-2"
                />
                <Button className="searchButton" onClick={fetchCasesByAdvocate} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </Button>
            </Form>

            {/*  Display Cases */}
            <Row className="justify-content-center">
                {cases.length > 0 ? (
                    cases.map((caseItem) => (
                        <Col md={4} key={caseItem._id} className="mb-3">
                            <Card className="shadow">
                                <Card.Body>
                                    <Card.Title>Case: {caseItem.casetitle}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Category: {caseItem.category}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Filed By:</strong> {caseItem.clientname} <br />
                                        <strong>Advocate :</strong> {caseItem.advocatefirstname} {caseItem.advocatelastname}<br />
                                        <strong>Advocate Email:</strong> {caseItem.advocateEmail} <br />
                                        <strong>Status:</strong> {caseItem.isActive ? "Active" : "Inactive"} <br />
                                        <strong>Approval Status:</strong> {caseItem.approvalStatus} <br />
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center mt-3">No cases found.</p>
                )}
            </Row>
        </Container>
       </div>
    );
};

export default AdminCases;
