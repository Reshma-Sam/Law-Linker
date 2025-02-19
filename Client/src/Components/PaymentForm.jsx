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
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiUrl}/payment/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPayments(response.data);
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
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.recipientEmail}</td>
                                <td>{payment.amount / 100} {payment.currency.toUpperCase()}</td>
                                <td>{payment.status}</td>
                                <td>{new Date(payment.created * 1000).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default PaymentForm;
