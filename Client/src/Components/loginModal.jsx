import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; //  Import useNavigate
import arrow from "../Assets/Arrow.png";

function LoginModal({ show, handleClose, handleShowSignupAdmin }) {
  const apiUrl = import.meta.env.VITE_API_URL
  const [usertype, setUsertype] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);



  const navigate = useNavigate(); //  Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Sending data:", { email, password, usertype })

    try {
      const response = await axios.post(`${apiUrl}/login/all`, {
        email,
        password,
        usertype,
      });

      console.log("Response:", response.data)

      if (response.data.token) {
        console.log("Saving token to localStorage...")
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setAuth(true);
        setUser(response.data.user);

        if (response.data.user) {
          localStorage.setItem("userType", response.data.user.usertype);
          localStorage.setItem("userId", response.data.user.id);
          localStorage.setItem("token", response.data.token);
        } else {
          console.error("Login Error: User data missing in response");
        }


        alert("Login successful!");
        console.log("Updated auth state:", { isAuth: true, user: response.data.user })

        handleClose();

        //  Trigger re-render
        setTimeout(() => {
          window.location.reload();
        }, 100);  // Small delay to let state update


        //  Redirect based on user type
        if (usertype === "admin") {
          navigate("/admin-dashboard");
        } else if (usertype === "advocate") {
          navigate("/advocate-dashboard");
        } else if (usertype === "jr.advocate") {
          navigate("/jr.advocate-dashboard");
        } else if (usertype === "client") {
          navigate("/client-dashboard");
        }else {
          navigate("/"); // Default home page for other users
        }
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-centered custom-modal p-0 border-0">
      <Modal.Header className="modal-header">
        <span className="close-btn" onClick={handleClose}>
          <img src={arrow} alt="arrow" width="20" height="auto" />
        </span>
      </Modal.Header>

      <Modal.Title className="text-center login-heading">Log In</Modal.Title>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <div className="modal-form">
            {/* User Type Dropdown */}
            <Form.Group controlId="formUsertype" className="d-flex align-items-center mb-3">
              <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>User Type <span className="text-danger ms-1">*</span></Form.Label>
              <Form.Select value={usertype} onChange={(e) => setUsertype(e.target.value)} required>
                <option value="">Select User Type</option>
                <option value="admin">Admin</option>
                <option value="advocate">Advocate</option>
                <option value="jr.advocate">Jr. Advocate</option>
                <option value="client">Client</option>
              </Form.Select>
            </Form.Group>

            {/* Email Input */}
            <Form.Group controlId="formEmail" className="d-flex align-items-center mb-3">
              <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Email <span className="text-danger ms-1">*</span></Form.Label>
              <Form.Control type="email" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            {/* Password Input */}
            <Form.Group controlId="formPassword" className="d-flex align-items-center mb-3">
              <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Password <span className="text-danger ms-1">*</span></Form.Label>
              <Form.Control type="password" placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <span className="forgot-password">Forgot Password?</span>
          </div>
          <center className="login-padding">
            <Button className="loginButton" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </center>
          <center className="click-padding">
            <span>Don't have an account?
              <span onClick={handleShowSignupAdmin} style={{ color: "blue", cursor: "pointer" }}> Click Here </span>
            </span>
          </center>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
