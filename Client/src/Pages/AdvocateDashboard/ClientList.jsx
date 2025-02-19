import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Container,Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdvocateClients = ({ advocateEmail }) => {
  const apiUrl = import.meta.env.VITE_API_URL

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      console.log('Advocate Email:', advocateEmail);
      try {
        const token = localStorage.getItem('token')
        const decodedToken = JSON.parse(atob(token.split('.')[1])); 
        const advocateEmail = decodedToken.email;


        const response = await axios.get(` ${apiUrl}/advocate/clients/${advocateEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setClients(response.data.clients);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('Failed to fetch clients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [advocateEmail])

  const handleViewProfile = (client) => {
    navigate(`/profile-client/other/client/${client._id}`);
};

  if (loading) return <Spinner animation="border" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="client-list-container">
        <h3 className="mb-4">Client List</h3>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>State</th>
                    <th>District</th>
                    <th>View Profile</th>
                </tr>
            </thead>
            <tbody>
                {clients.map((client, index) => (
                    <tr key={client._id}>
                        <td>{index + 1}</td>
                        <td>{client.clientname}</td>
                        <td>{client.email}</td>
                        <td>{client.mobile}</td>
                        <td>{client.state}</td>
                        <td>{client.district}</td>
                        <td>
                            <Button 
                                className='loginButton' 
                                onClick={() => handleViewProfile(client)}
                            >
                                View
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
);
};

export default AdvocateClients;
