import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import axios from 'axios';

const JrAdvocateTasklist = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [tasks, setTasks] = useState([]);

    // Fetch allocated tasks
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${apiUrl}/advocate/jradvocate-allocatedtasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data.tasks);
        } catch (error) {
            console.error('Failed to fetch allocated tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Update Task Status
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${apiUrl}/advocate/update-allocated-task/${taskId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (res.data.success) {
                // Update the tasks array with the new status
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, status: newStatus } : task
                    )
                );
                alert('Task status updated successfully.');
            } else {
                alert('Failed to update task status.');
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };
    

    // Status badge color based on status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'active':
                return 'info';
            case 'completed':
                return 'success';
            default:
                return 'secondary';
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #333, #d2cfca)', padding: '30px' }}>
            <Container className="p-4 bg-white rounded shadow">
                <h2 className="text-center mb-4" style={{ color: '#333' }}>Allocated Tasks</h2>

                {tasks.length > 0 ? (
                    <Table striped bordered hover responsive>
                        <thead style={{ backgroundColor: '#343a40', color: '#fff' }}>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Assigned To</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Change Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (
                                <tr key={task._id}>
                                    <td>{index + 1}</td>
                                    <td>{task.title}</td>
                                    <td>{task.description || 'N/A'}</td>
                                    <td>{task.assignedTo?.firstname} {task.assignedTo?.lastname}</td>
                                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <span className={`badge bg-${getStatusBadge(task.status)}`}>
                                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <Form.Select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p className="text-center">No allocated tasks found.</p>
                )}
            </Container>
        </div>
    );
};

export default JrAdvocateTasklist;
