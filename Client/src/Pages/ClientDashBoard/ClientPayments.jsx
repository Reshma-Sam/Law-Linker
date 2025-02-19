import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Container, Button, Form, Alert, Card, InputGroup, Spinner } from "react-bootstrap";
import { Envelope } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51QnKiAFCcQX52WfYG29fFIttnHJ6Hrk739AcawssdbJdtOKR6Ix4iQ39xleU24kfQzkS8s4xGVKBsZhO34QcWDUt004ZYivYbI");

const ClientPayment = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(500);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("")
  const navigate = useNavigate();

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not logged in! Please log in first.");
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement not found.");
      return;
    }

    setIsPaymentProcessing(true);

    try {
      const response = await axios.post(
        ` ${apiUrl}/payment/pay`,
        { amount, clientName, clientEmail,recipientEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("PaymentIntent Response:", response.data);

      const { clientSecret, paymentId } = response.data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: clientName, email: clientEmail }
        }
      });

      if (error) {
        console.error("Payment failed:", error);
        setMessage("Payment failed. Please try again.");
      } else if (paymentIntent.status === "succeeded") {
        console.log("Payment successful:", paymentIntent);
        setMessage("Payment Successful!");
        navigate("/payment-success", {
          state: { paymentId: paymentIntent.id, clientName, clientEmail, amount, recipientEmail }
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment error. Please try again later.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="shadow-lg bg-light" style={{ maxWidth: "450px", borderRadius: "12px" }}>
        <Card.Body>
          {/* 🔹 New Payment History Button */}
          <Button
            variant="info"
            className="w-100 fw-bold mb-3"
            onClick={() => navigate("/payment-history")}
          >
            View Payment History 📜
          </Button>

          <h3 className="text-center text-primary fw-bold">Secure Payment</h3>
          <p className="text-center text-muted">Complete your payment to confirm your appointment.</p>

          {message && <Alert variant="danger">{message}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount (₹ INR)</Form.Label>
              <InputGroup>
                <InputGroup.Text>₹</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text><Envelope /></InputGroup.Text>
                <Form.Control
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Recipient Email (Pay To)</Form.Label>
              <InputGroup>
                <InputGroup.Text><Envelope /></InputGroup.Text>
                <Form.Control
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Card Information</Form.Label>
              <CardElement />
            </Form.Group>

            <Button
              variant="secondary"
              className="w-100 fw-bold mb-2"
              onClick={handlePayment}
              disabled={isPaymentProcessing}
            >
              {isPaymentProcessing ? <Spinner animation="border" size="sm" /> : "Pay Now 💳"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientPayment;
