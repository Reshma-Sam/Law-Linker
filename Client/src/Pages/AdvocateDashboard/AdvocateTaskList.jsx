import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const AdvocateTaskList = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [tasks, setTasks] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editedTask, setEditedTask] = useState({ title: '', description: '', dueDate: '' });

    // Date Validation
    const isValidDueDate = (date) => {
        const today = new Date().toISOString().split('T')[0];
        return date >= today;
    };

    // Fetch Task List
    const fetchTaskList = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${apiUrl}/advocate/advocate-tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data.tasks);
        } catch (error) {
            console.error('Failed to fetch task list:', error);
        }
    };

    useEffect(() => {
        fetchTaskList();
    }, []);

    // Delete Task
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiUrl}/advocate/delete-task/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Task deleted successfully.');
            fetchTaskList();
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Failed to delete task.');
        }
    };

    // Open Edit Modal
    const handleEditTask = (task) => {
        setSelectedTask(task);
        setEditedTask({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate?.split('T')[0] || '',
        });
        setShowEditModal(true);
    };

    // Update Task
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (!editedTask.title || !editedTask.description || !editedTask.dueDate) {
            alert('All fields are required.');
            return;
        }

        if (!isValidDueDate(editedTask.dueDate)) {
            alert('Due date cannot be in the past.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${apiUrl}/advocate/update-task/${selectedTask._id}`,
                editedTask,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Task updated successfully.');
            setShowEditModal(false);
            fetchTaskList();
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Failed to update task.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className='text-center'>Task List</h2>
            <Button variant="secondary" onClick={fetchTaskList} className="mb-3">
                Refresh Task List
            </Button>

            {tasks.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr key={task._id}>
                                <td>{index + 1}</td>
                                <td>{task.title}</td>
                                <td>{task.description || 'N/A'}</td>
                                <td>{task.assignedTo?.firstname} {task.assignedTo?.lastname}</td>
                                <td>{task.status}</td>
                                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <Button size="sm" className="me-2 aprovalButton" onClick={() => handleEditTask(task)}>
                                        Edit
                                    </Button>
                                    <Button className='rejectionButton' size="sm" onClick={() => handleDeleteTask(task._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No tasks found.</p>
            )}

            {/* Edit Task Modal */}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                dialogClassName="custom-modal-width"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateTask}>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTask.title}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editedTask.description}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={editedTask.dueDate}
                                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </Form.Group>

                        <Button variant="secondary" type="submit">Update Task</Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default AdvocateTaskList;
