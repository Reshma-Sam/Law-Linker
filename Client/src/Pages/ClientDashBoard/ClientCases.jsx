import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Card, Button, Form, Row, Col } from "react-bootstrap";

const ClientCases = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState({}); // State for message inputs

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please login.");
            setLoading(false);
            return;
        }

        let clientEmail = "";
        try {
            const decoded = jwtDecode(token);
            clientEmail = decoded.email;
        } catch (err) {
            setError("Invalid token");
            setLoading(false);
            return;
        }

        const fetchCases = async () => {
            try {
                const response = await axios.get(`${apiUrl}/client/cases`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCases(response.data.cases);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching cases");
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    const handleMessageChange = (e, caseId) => {
        setMessages({ ...messages, [caseId]: e.target.value });
    };

    const handleSendMessage = async (caseId, advocateEmail) => {
        const token = localStorage.getItem("token");
        const message = messages[caseId];
        if (!message) return alert("Message cannot be empty");

        try {
            await axios.post(`${apiUrl}/client/send-message`, {
                caseId,
                advocateEmail,
                message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Message sent successfully!");
            setMessages({ ...messages, [caseId]: "" }); // Clear message input
        } catch (error) {
            alert(error.response?.data?.message || "Error sending message");
        }
    };

    if (loading) return <p>Loading cases...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (

    <div className="container mt-4">
        <h2 className="text-center">My Cases</h2>
        {cases.length === 0 ? (
            <p>No cases found.</p>
        ) : (
            <Row>
                {cases.map((caseItem) => (
                    <Col md={4} key={caseItem._id} className="mb-4">
                        <Card className="shadow">
                            <Card.Body>
                                <Card.Title className="text-secondary">{caseItem.casetitle}</Card.Title>
                                <Card.Text>
                                    <strong>Category:</strong> {caseItem.category} <br />
                                    <strong>Specialization:</strong> {caseItem.specialization} <br />
                                    <strong>Description:</strong> {caseItem.caseDescription} <br />
                                    <strong>Status:</strong> {caseItem.approvalStatus} <br />
                                </Card.Text>
                                <h5 className="text-secondary">Advocate Details</h5>
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Name:</strong> {caseItem.advocatefirstname} {caseItem.advocatelastname}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Email:</strong> {caseItem.advocateEmail}</p>
                                    </Col>
                                </Row>

                                <Form.Group className="mt-3">
                                    <Form.Label><strong>Send Message to Advocate</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type your message..."
                                        value={messages[caseItem._id] || ""}
                                        onChange={(e) => handleMessageChange(e, caseItem._id)}
                                    />
                                </Form.Group>

                                <Button
                                    variant="dark"
                                    className="mt-2"
                                    onClick={() => handleSendMessage(caseItem._id, caseItem.advocateEmail)}
                                >
                                    Send Message
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        )}
    </div>

    );
};

export default ClientCases;
