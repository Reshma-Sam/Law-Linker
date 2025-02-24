import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Card, Row, Col } from "react-bootstrap";

function ClientAppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState({
        _id: "",
        subject: "",
        date: "",
        time: "",
        message: ""
    });

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${apiUrl}/client/appointment-list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${apiUrl}/client/appointment/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Appointment deleted successfully!");
            fetchAppointments();
        } catch (error) {
            console.error("Failed to delete appointment:", error);
            alert("Failed to delete appointment.");
        }
    };

    const handleEdit = (appointment) => {
        setCurrentAppointment(appointment);
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentAppointment({ ...currentAppointment, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.put(`${apiUrl}/client/appointment/${currentAppointment._id}`, currentAppointment, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Appointment updated successfully!");
            setShowEditModal(false);
            fetchAppointments();
        } catch (error) {
            console.error("Failed to update appointment:", error);
            alert("Failed to update appointment.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center"> Your Appointments</h2>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appointments.map((appointment) => (
                    <Card key={appointment._id} className="mb-3 p-3 mx-auto" style={{ width: "90%", maxWidth: "1200px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        <Row>
                            <Col md={9}>
                                <p><strong>Advocate Email:</strong> {appointment.advocateEmail}</p>
                                <p><strong>Subject:</strong> {appointment.subject}</p>
                                <p><strong>Date:</strong> {appointment.date}</p>
                                <p><strong>Time:</strong> {appointment.time}</p>
                                <p><strong>Message:</strong> {appointment.message}</p>
                                <p><strong>Status:</strong> {appointment.status}</p>
                            </Col>
                            <Col md={3} className="d-flex align-items-center justify-content-end">
                                <Button className="aprovalButton me-2" size="sm" onClick={() => handleEdit(appointment)} >Edit</Button>
                                <Button className="rejectionButton" size="sm" onClick={() => handleDelete(appointment._id)}>Delete</Button>
                            </Col>
                        </Row>
                    </Card>
                ))
            )}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                name="subject"
                                value={currentAppointment.subject}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={currentAppointment.date}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={currentAppointment.time}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="message"
                                value={currentAppointment.message}
                                onChange={handleEditChange}
                                rows={3}
                                required
                            />
                        </Form.Group>
                        <Button variant="secondary" type="submit">Save Changes</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ClientAppointmentList;
