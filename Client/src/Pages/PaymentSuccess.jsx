import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Alert, Spinner, Card } from "react-bootstrap";

const PaymentSuccess = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Extract payment details from location state (passed from previous page)
    const paymentId = location.state?.paymentId;
    const clientName = location.state?.clientName;
    const clientEmail = location.state?.clientEmail;
    const amount = location.state?.amount;

    useEffect(() => {
        if (!paymentId) {
            setMessage("Payment ID is missing. Please complete payment first.");
        }
    }, [paymentId]);

    const handleGenerateInvoice = async () => {
        if (!paymentId || !clientName || !clientEmail || !amount) {
            setMessage("Missing details for invoice generation.");
            return;
        }
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("User is not authenticated. Please log in again.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "${apiUrl}/invoice/generate-invoice",
                { clientName, clientEmail, amount, paymentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.invoiceUrl) {
                window.open(response.data.invoiceUrl, "_blank");
            }
        } catch (error) {
            console.error("Error generating invoice:", error);
            setMessage("Failed to generate invoice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center min-vh-50">
            <Card className="p-4 shadow rounded" style={{ width: '100%', maxWidth: '500px' }}>
                <Alert variant="success" className="text-center mb-4">
                    🎉 Payment Successful!
                </Alert>

                {message && <Alert variant="danger">{message}</Alert>}

                <div className="text-center mb-4">
                    <h5>Payment Details</h5>
                    <p><strong>Client:</strong> {clientName}</p>
                    <p><strong>Email:</strong> {clientEmail}</p>
                    <p><strong>Amount Paid:</strong> ₹{amount}</p>
                    <p><strong>Payment ID:</strong> {paymentId}</p>
                </div>

                <Button
                    variant="secondary"
                    className="mt-3 d-block w-100" // Use these classes for full-width
                    onClick={handleGenerateInvoice}
                    disabled={loading || !paymentId}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : "Download Invoice 🧾"}
                </Button>

                <Button
                    variant="secondary"
                    className="mt-3 d-block w-100" // Use these classes for full-width
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </Button>

            </Card>
        </Container>
    );
};

export default PaymentSuccess;
