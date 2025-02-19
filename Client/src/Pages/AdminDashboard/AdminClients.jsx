// React Component: AdminClient.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomAlert from '../../Components/CustomAlert';

function AdminClient() {
    const apiUrl = import.meta.env.VITE_API_URL
    const [clients, setClients] = useState([]);
    const [clientName, setClientName] = useState(''); // Added missing state
    const [advocateFirstName, setAdvocateFirstName] = useState('');
    const [advocateLastName, setAdvocateLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Function to show the custom alert
    const triggerAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
    };

    useEffect(() => {
        fetchAllClients();
    }, []);

    const fetchAllClients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiUrl}/auth/clients`, {
                params: { advocateFirstName, advocateLastName },
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(response.data.clients);
        } catch (error) {
            console.error('Failed to fetch clients', error);
        }
    };

    const fetchClientByName = async () => {
        const token = localStorage.getItem('token');
        if (!clientName.trim()) {
            triggerAlert('Please enter a client name.');
            return;
        }
        try {
            const response = await axios.get(`${apiUrl}/auth/getClientByName?clientname=${clientName.trim()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(response.data.clients);
        } catch (error) {
            console.error('Failed to fetch client details:', error);
            triggerAlert(error.response?.data?.message || 'Failed to fetch client details');
        }
    };

    return (
        <div className="position-relative">
            <div className="top-center-alert">
                <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
            </div>

            <div className="container">
                <h2 className="mb-4">Client Management</h2>

                <div className="mb-3 d-flex">
                    <input
                        type="text"
                        placeholder="Enter Client Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="form-control me-2"
                    />
                    <button className="searchButton" onClick={fetchClientByName}>Search</button>
                </div>

                <div className="client-list">
                    <center>
                        <div className="row">
                            {clients.map((client) => (
                                <div key={client._id} className="col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img
                                                    src={client.profilePicture || "https://dummyimage.com/200"}
                                                    alt={client.clientname}
                                                    className="img-fluid rounded-start"
                                                    style={{ height: '100%',width:'100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <h5 className="card-title">{client.clientname}</h5>
                                                    <p className="card-text">Email: {client.email}</p>
                                                    <p className="card-text">Mobile: {client.mobile}</p>
                                                    <p className="card-text">State: {client.state}</p>
                                                    <p className="card-text">District: {client.district}</p>
                                                    <p className="card-text">Advocate: {client.advocateEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </center>
                </div>

            </div>
        </div>
    );
}

export default AdminClient;
