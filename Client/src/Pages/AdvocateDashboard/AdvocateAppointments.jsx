import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Alert, Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';

const AdvocateAppointments = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [approvedAppointments, setApprovedAppointments] = useState([]);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAppointments();
        const interval = setInterval(removeExpiredAppointments, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/advocate/appointments`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const currentDate = new Date();

            // Categorize appointments
            const approved = response.data.filter(appt =>
                appt.status === "approved" && new Date(`${appt.date}T${appt.time}`) > currentDate
            );
            const pending = response.data.filter(appt => appt.status !== "approved");

            setApprovedAppointments(approved);
            setPendingAppointments(pending);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `${apiUrl}/advocate/appointment-status/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);

            if (status === "approved") {
                const approvedAppt = pendingAppointments.find(appt => appt._id === id);
                setApprovedAppointments([...approvedAppointments, approvedAppt]);
                setPendingAppointments(pendingAppointments.filter(appt => appt._id !== id));
            } else {
                setPendingAppointments(pendingAppointments.filter(appt => appt._id !== id));
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setMessage("Failed to update status.");
        }
    };

    const removeExpiredAppointments = () => {
        const now = new Date();
        setApprovedAppointments(prevAppointments =>
            prevAppointments.filter(appt => new Date(`${appt.date}T${appt.time}`) > now)
        );
    };

    return (
        <Container className="p-4" style={{ maxWidth: "1100px", backgroundColor: "#d7d5cd", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>

            {message && <Alert variant="info">{message}</Alert>}

            {/* Approved Appointments Section */}

            <div className="mb-5">
                <h3 className="text-center" style={{ color: "black" }}>Upcoming Approved Appointments</h3>
                <hr />
                {approvedAppointments.length === 0 ? (
                    <p className="text-center">No upcoming approved appointments.</p>
                ) : (
                    <Row className="g-4"> {/* Adds spacing between rows */}
                        {approvedAppointments.map(appointment => (
                            <Col key={appointment._id} md={4}> {/* Two cards per row on medium screens and larger */}
                                <Card className="p-3" style={{ backgroundColor: "#e3f2fd", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", borderRadius: "5px" }}>
                                    <Card.Body>
                                        <Card.Title>{appointment.clientName}</Card.Title>
                                        <Card.Text><strong>Email:</strong> {appointment.clientEmail}</Card.Text>
                                        <Card.Text><strong>Date:</strong> {appointment.date} | <strong>Time:</strong> {appointment.time}</Card.Text>
                                        <Card.Text><strong>Subject:</strong> {appointment.subject}</Card.Text>
                                        <Card.Text><strong>Message:</strong> {appointment.message}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Pending Appointments Section */}
            <div>
                <h3 className="text-center" style={{ color: "black" }}>Appointments for Approval</h3>
                <hr />
                {pendingAppointments.length === 0 ? (
                    <p className="text-center">No pending appointments for approval.</p>
                ) : (
                    pendingAppointments.map(appointment => (
                        <Card key={appointment._id} className="mb-3" style={{ padding: "15px", backgroundColor: "#f8f9fa", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", borderRadius: "5px", maxWidth: "1100px" }}>
                            <Card.Body>
                                <Card.Title>{appointment.clientName}</Card.Title>
                                <Card.Text><strong>Email:</strong> {appointment.clientEmail}</Card.Text>
                                <Card.Text><strong>Date:</strong> {appointment.date} | <strong>Time:</strong> {appointment.time}</Card.Text>
                                <Card.Text><strong>Subject:</strong> {appointment.subject}</Card.Text>
                                <Card.Text><strong>Message:</strong> {appointment.message}</Card.Text>
                            </Card.Body>
                            <div className="d-flex gap-2">
                                <Button className="aprovalButton" size="sm" onClick={() => handleStatusChange(appointment._id, "approved")}>
                                    Approve
                                </Button>
                                <Button className="rejectionButton" size="sm" onClick={() => handleStatusChange(appointment._id, "rejected")}>
                                    Reject
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

        </Container>
    );
};

export default AdvocateAppointments;
