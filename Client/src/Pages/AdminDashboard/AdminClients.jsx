import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomAlert from '../../Components/CustomAlert';

function AdminClient() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(response.data.clients);
        } catch (error) {
            console.error('Failed to fetch clients', error);
        }
    };

    // Multi-field search
    const filteredClients = clients.filter(client => {
        const query = searchQuery.toLowerCase();
        return (
            client.clientname?.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query) ||
            client.mobile?.toString().includes(query) ||
            client.state?.toLowerCase().includes(query) ||
            client.district?.toLowerCase().includes(query) ||
            client.advocateEmail?.some(email => email.toLowerCase().includes(query))
        );
    });

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
                        placeholder="Search by name, email, mobile, state, district, etc."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control me-2"
                    />
                </div>

                <div className="client-list">
                    <center>
                        <div className="row">
                            {filteredClients.map((client) => (
                                <div key={client._id} className="col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img
                                                    src={client.profilePicture || "https://dummyimage.com/200"}
                                                    alt={client.clientname}
                                                    className="img-fluid rounded-start"
                                                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <h5 className="card-title">{client.clientname}</h5>
                                                    <p className="card-text">Email: {client.email}</p>
                                                    <p className="card-text">Mobile: {client.mobile}</p>
                                                    <p className="card-text">State: {client.state}</p>
                                                    <p className="card-text">District: {client.district}</p>
                                                    <p className="card-text">Advocate: {client.advocateEmail?.join(", ")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredClients.length === 0 && <p>No clients found matching the search criteria.</p>}
                    </center>
                </div>
            </div>
        </div>
    );
}

export default AdminClient;
