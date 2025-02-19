import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card className="text-center shadow-lg p-4 bg-light" style={{ maxWidth: "450px", borderRadius: "10px" }}>
                <ExclamationTriangleFill color="red" size={60} className="mx-auto mb-3" />
                <Card.Title className="text-danger fs-3 fw-bold">Payment Failed! ❌</Card.Title>
                <Card.Body>
                    <Card.Text className="text-muted">
                        There was an issue with your payment. Please check your details and try again.
                    </Card.Text>
                    <Button variant="danger" className="me-2" onClick={() => navigate("/retry-payment")}>
                        Retry Payment
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PaymentFailed;
