import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

// Function to get the logged-in advocate's email from the JWT token
const getLoggedInAdvocateEmail = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("No token found in localStorage.");
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);

        // Check if the token has expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.warn("Token has expired. Clearing localStorage.");
            localStorage.removeItem("token");
            return null;
        }

        return decodedToken.email || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const TrackPayment = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const advocateEmail = getLoggedInAdvocateEmail();
                if (!advocateEmail) {
                    console.warn("No advocate email found.");
                    return;
                }
        
                const response = await axios.get(`${apiUrl}/payment//advocate/history`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    params: { recipientEmail: advocateEmail },
                });
        
                console.log("API Response:", response.data); // Check this output
                setPayments(response.data.payments || []); // Ensure it accesses the array properly
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
                        <th>Recipient Email</th>
                        <th>Amount (₹)</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.paymentId || payment.id}>
                            <td>{payment.paymentId || payment.id}</td>
                            <td>{payment.receiptEmail}</td>
                            <td>{payment.amount} {payment.currency?.toUpperCase() || "INR"}</td>
                            <td>{payment.paymentStatus}</td>
                            <td>{new Date(payment.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>            
            )}
        </Container>
    );
};

export default TrackPayment;
