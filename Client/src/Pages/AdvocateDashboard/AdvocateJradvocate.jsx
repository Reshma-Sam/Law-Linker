import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const AdvocateJradvocate = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [jrAdvocates, setJrAdvocates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedAdvocate, setSelectedAdvocate] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '', description: '', dueDate: '' });

    // Fetch Task List
    const fetchTaskList = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${apiUrl}/advocate/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data.tasks);
            setShowModal(true);
        } catch (error) {
            console.error('Failed to fetch task list:', error);
        }
    };
    
    // Fetch Junior Advocates
    useEffect(() => {
        const fetchJrAdvocates = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${apiUrl}/advocate/junior-advocates`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJrAdvocates(res.data.jrAdvocates || []);
            } catch (error) {
                console.error('Failed to fetch junior advocates:', error);
            }
        };
        fetchJrAdvocates();
    }, []);

    // Filtered Advocates based on Search (multi-field search)
    const filteredAdvocates = jrAdvocates.filter((advocate) => {
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

    // Open Modal for Task Allocation
    const handleAllocateTask = (advocate) => {
        setSelectedAdvocate(advocate);
        setShowModal(true);
        setTask({ title: '', description: '', dueDate: '' });
    };

    // Handle Task Submission
    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        if (!task.title.trim() || !task.description.trim() || !task.dueDate.trim()) {
            alert('All fields are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${apiUrl}/advocate/allocate-task`,
                {
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate,
                    jrAdvocateId: selectedAdvocate._id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to allocate task:', error);
            alert(error.response?.data?.message || 'Task allocation failed.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className='text-center'>Junior Advocates</h2>
            <div className='text-center pb-5'>
            <Button variant="secondary" onClick={fetchTaskList}>
                Show Task List
            </Button>
            </div>
            {/* Search Bar (multi-field search) */}
            <Form.Control
                type="text"
                placeholder="Search by name, email, specialization, state, or district..."
                className="mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Junior Advocates Cards */}
            {filteredAdvocates.length > 0 ? (
                <Row xs={1} md={3} className="g-4">
                    {filteredAdvocates.map((advocate) => (
                        <Col key={advocate._id}>
                            <Card style={{ backgroundColor: '#b0aba3', color: 'black', height: '100%' }}>
                                <Card.Img
                                    variant="top"
                                    src={advocate.profilePicture || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title>{`${advocate.firstname} ${advocate.lastname}`}</Card.Title>
                                    <Card.Text>Email: {advocate.email}</Card.Text>
                                    <Card.Text>Mobile: {advocate.mobile}</Card.Text>
                                    <Card.Text>Specialization: {advocate.specialization}</Card.Text>
                                    <Card.Text>Location: {advocate.district}, {advocate.state}</Card.Text>
                                    <Button variant="dark" onClick={() => handleAllocateTask(advocate)}>
                                        Allocate Task
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No junior advocates found.</p>
            )}

            {/* Modal for Task Allocation */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Allocate Task for {selectedAdvocate?.firstname} {selectedAdvocate?.lastname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleTaskSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task title"
                                value={task.title}
                                onChange={(e) => setTask({ ...task, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter task description"
                                value={task.description}
                                onChange={(e) => setTask({ ...task, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={task.dueDate}
                                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="dark" type="submit">
                            Allocate Task
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdvocateJradvocate;
