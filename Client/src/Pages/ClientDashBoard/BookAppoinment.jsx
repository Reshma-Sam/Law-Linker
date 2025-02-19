import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Form, Button, Alert, Container } from "react-bootstrap";

const BookAppointment = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [client, setClient] = useState({ email: "", name: "" });
    const [advocateEmail, setAdvocateEmail] = useState(""); // Editable advocate email
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");

    // Auto-fill client details from JWT token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setClient({
                    email: decodedToken.email || "",  
                    name: decodedToken.name || "",    
                });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMessage("");

        if (!advocateEmail || !date || !time || !subject || !message) {
            setResponseMessage("All fields are required.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${apiUrl}/client/book-appointment`,
                { 
                    clientEmail: client.email,
                    clientName: client.name,
                    advocateEmail, 
                    date, 
                    time, 
                    subject, 
                    message 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setResponseMessage(response.data.message);
            setAdvocateEmail("");
            setDate("");
            setTime("");
            setSubject("");
            setMessage("");
        } catch (error) {
            setResponseMessage(error.response?.data?.message || "Error booking appointment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="p-4" style={{ maxWidth: "500px", backgroundColor: "#d7d5cd", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
            <h3 className="text-center" style={{ color: "black" }}>Book an Appointment</h3>
            {responseMessage && (
                <Alert variant={responseMessage.includes("success") ? "success" : "danger"}>
                    {responseMessage}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {/* Auto-filled Client Email */}
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black" }}>Your Email:</Form.Label>
                    <Form.Control type="email" value={client.email} disabled />
                </Form.Group>

                {/* Manually Enter Advocate Email */}
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black" }}>Advocate Email:</Form.Label>
                    <Form.Control type="email" value={advocateEmail} onChange={(e) => setAdvocateEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black" }}>Date:</Form.Label>
                    <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black" }}>Time:</Form.Label>
                    <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black" }}>Subject:</Form.Label>
                    <Form.Control type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black" }}>Message:</Form.Label>
                    <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} required />
                </Form.Group>

                <Button variant="dark" type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "black", color: "#d7d5cd" }}>
                    {loading ? "Booking..." : "Book Appointment"}
                </Button>
            </Form>
        </Container>
    );
};

export default BookAppointment;
