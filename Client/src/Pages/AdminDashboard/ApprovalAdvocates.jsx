import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Alert } from "react-bootstrap";
import CustomAlert from "../../Components/CustomAlert";

const ApprovalAdvocates = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [advocates, setAdvocates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    // Function to show the custom alert
    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
    };


    useEffect(() => {
        fetchPendingAdvocates();
    }, []);

    const fetchPendingAdvocates = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No authentication token found.");
            }
            const response = await axios.get(` ${apiUrl}/auth/pending-advocates`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdvocates(response.data.pendingAdvocates);
        } catch (err) {
            setError("No pending advocates found.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No authentication token found.");
            }

            const response = await axios.put(` ${apiUrl}/auth//update-advocate-status/${id}`,
                { approvalStatus: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            triggerAlert(response.data.message);
            setAdvocates(advocates.filter(advocate => advocate._id !== id)); // Remove from UI
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <Container className="mt-4">
            <h3 className="text-center mb-4">Pending Advocates</h3>
            <div className="position-relative">
                <div className="top-center-alert">
                    <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : advocates.length === 0 ? (
                    <Alert variant="warning" className="text-center">No pending advocates found.</Alert>
                ) : (
                    <Row>
                        {advocates.map((advocate) => (
                            <Col key={advocate._id} md={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{advocate.firstname} {advocate.lastname}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{advocate.usertype}</Card.Subtitle>
                                        <Card.Subtitle className="mb-2 text-muted">{advocate.email}</Card.Subtitle>
                                        <Card.Text>Specialization: {advocate.specialization}</Card.Text>
                                        <div className="d-flex justify-content-between">
                                            <Button
                                                className="aprovalButton"
                                                onClick={() => handleUpdateStatus(advocate._id, "accepted")}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                className="rejectionButton"
                                                onClick={() => handleUpdateStatus(advocate._id, "rejected")}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )
                }
                </div>
        </Container >
    );
};


export default ApprovalAdvocates