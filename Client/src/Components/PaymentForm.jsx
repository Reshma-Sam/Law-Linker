import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem('token');
            console.log("Token in Local Storage:", token);

            if (!token) {
                console.error("No token found!");
                return;
            }

            try {
                const response = await axios.get('http://localhost:5500/api/payment/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("API Response:", response.data);  // Log the response
                setPayments(response.data.payments || []);  // Ensure it's an array
            } catch (error) {
                console.error("Error fetching payment history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);


    return (
        <Container>
            <h2 className="my-4 text-center">Payment History</h2>

            <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
                ← Back to Payment Page
            </Button>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : payments.length === 0 ? (
                <p className="text-center">No payment history found.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>Payment To</th>
                            <th>Amount (₹)</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id || Math.random()}>
                                <td>{payment.id || 'N/A'}</td>
                                <td>{payment.recipientEmail || 'N/A'}</td>
                                <td>{payment.amount} {payment.currency?.toUpperCase() || 'INR'}</td>
                                <td>{payment.status || 'N/A'}</td>
                                <td>{payment.created ? new Date(payment.created).toLocaleString() : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            )}
        </Container>
    );
};

export default PaymentForm;
