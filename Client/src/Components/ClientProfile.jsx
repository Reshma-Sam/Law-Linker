import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Spinner, Form, Button, Row, Col } from 'react-bootstrap';
import Footer from './Footer';
import CustomAlert from './CustomAlert';

const ClientProfile = () => {
    const apiUrl = import.meta.env.VITE_API_URL

    const { userType, id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        clientname: '',
        email: '',
        mobile: '',
        state: '',
        district: '',
        username: '',
        advocateEmail: '',
        message: '',
    });
    const [alertMessage, setAlertMessage] = useState('');

    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(''), 3000);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${apiUrl}/profile/other/${userType}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const clientData = response.data.user;
                setClient(clientData);
                setFormData({
                    clientname: clientData.clientname,
                    email: clientData.email,
                    mobile: clientData.mobile,
                    state: clientData.state,
                    district: clientData.district,
                    username: clientData.username,
                    advocateEmail: clientData.advocateEmail,
                    message: ''
                });
            } catch (err) {
                triggerAlert('Failed to load client profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userType, id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        triggerAlert('Your message has been sent successfully!');
    };

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="position-relative">
            <div className="top-center-alert">
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />
            </div>
            <div className="profile-container">
                <div className="profile-header">
                    <img
                        src={client?.profilePicture || "https://dummyimage.com/200"}
                        alt="Profile"
                        className="profile-img"
                    />
                    <h2>{client?.clientname}</h2>
                    <p className="specialization">Client Profile</p>
                </div>

                <div className="profile-details">
                    <p><strong>Email:</strong> {client?.email}</p>
                    <p><strong>Mobile:</strong> {client?.mobile}</p>
                    <p><strong>State:</strong> {client?.state}</p>
                    <p><strong>District:</strong> {client?.district}</p>
                    <p><strong>Username:</strong> {client?.username}</p>
                    <p><strong>Advocate Email:</strong> {client?.advocateEmail}</p>
                </div>

                <section style={{ paddingTop: "50px" }}>
                    <div className="contactForm">
                        <h3 style={{ color: "black", fontWeight: "bold" }}>Contact {client?.clientname}</h3>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: "black", fontWeight: "bold" }}>Client Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="clientname"
                                            value={formData.clientname}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: "black", fontWeight: "bold" }}>Email <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: "black", fontWeight: "bold" }}>Message <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="dark" type="submit">Send</Button>
                            </div>
                        </Form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ClientProfile;