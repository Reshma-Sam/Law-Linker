import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Container, Alert, Image } from "react-bootstrap";

const JrAdvocateAproval = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch Jr. Advocate Requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${apiUrl}/advocate/junior-advocates`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setRequests(response.data.jrAdvocates);
            } catch (error) {
                console.error("Error fetching Jr. Advocate requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Handle Verification (Accept/Reject)
    const handleVerification = async (id, status) => {
        try {
            const response = await axios.put(
                `${apiUrl}/advocate/requests/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setMessage(response.data.message);
            setRequests(requests.filter((request) => request._id !== id)); // Remove verified request
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <Container>
            <h2 className="my-4 text-center">Jr. Advocate Verification Requests</h2>

            {message && <Alert variant="success">{message}</Alert>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : requests.length === 0 ? (
                <p>No pending Jr. Advocate requests.</p>
            ) : (
                <div>
                    {requests.map((advocate) => (
                        <Card key={advocate._id} className="mb-4 shadow-sm">
                            <Card.Body className="text-center">
                                {/* Profile Picture at the Top */}
                                <Image
                                    src={advocate.profilePicture || "https://via.placeholder.com/150"}
                                    alt={`${advocate.firstname} ${advocate.lastname}`}
                                    roundedCircle
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        marginBottom: "15px",
                                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
                                    }}
                                />

                                {/* Advocate Details */}
                                <h4>{advocate.firstname} {advocate.lastname}</h4>
                                <p><strong>Email:</strong> {advocate.email}</p>
                                <p><strong>Mobile:</strong> {advocate.mobile}</p>
                                <p><strong>Specialization:</strong> {advocate.specialization}</p>
                                <p><strong>District:</strong> {advocate.district}, {advocate.state}</p>

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-center mt-3">
                                    <Button
                                        size="md"
                                        className="me-3 aprovalButton"
                                        onClick={() => handleVerification(advocate._id, 'accepted')}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        size="md"
                                        className="rejectionButton"
                                        onClick={() => handleVerification(advocate._id, 'rejected')}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default JrAdvocateAproval;
