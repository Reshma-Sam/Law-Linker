// TaskAllocation.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskAllocation = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [jrAdvocates, setJrAdvocates] = useState([]);
    const [task, setTask] = useState({ title: "", description: "", jrAdvocateId: "", dueDate: "" });

    useEffect(() => {
        fetchJrAdvocates();
    }, []);

    const fetchJrAdvocates = async () => {
        try {
            const response = await axios.get(`${apiUrl}/auth/myJrAdvocates`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setJrAdvocates(response.data.jrAdvocates);
        } catch (error) {
            console.error("Failed to fetch Jr. Advocates", error);
        }
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${apiUrl}/tasks/allocate-task`,
                task,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            alert(response.data.message);
            setTask({ title: "", description: "", jrAdvocateId: "", dueDate: "" });
        } catch (error) {
            console.error("Failed to allocate task", error);
        }
    };

    return (
        <div>
            <h3>Allocate Task</h3>
            <form onSubmit={handleTaskSubmit}>
                <div className="mb-3">
                    <label>Jr. Advocate</label>
                    <select
                        className="form-control"
                        value={task.jrAdvocateId}
                        onChange={(e) => setTask({ ...task, jrAdvocateId: e.target.value })}
                        required
                    >
                        <option value="">Select Jr. Advocate</option>
                        {jrAdvocates.map((advocate) => (
                            <option key={advocate._id} value={advocate._id}>
                                {advocate.firstname} {advocate.lastname}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>Task Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label>Due Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={task.dueDate}
                        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Allocate Task</button>
            </form>
        </div>
    );
};

export default TaskAllocation;
