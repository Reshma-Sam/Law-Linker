import { React, useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import arrow from "../Assets/Arrow.png"

function SignupAdmin({ show, usertype, setUsertype, handleClose,setModalType, setShowModal, handleShowLogin, handleShowSignupAdvocate, handleShowSignupClient, handleShowSignupAdmin, handleShowSignupJrAdvocate }) {
  const apiUrl = import.meta.env.VITE_API_URL
  const [formData, setFormData] = useState({
    usertype: '',
    firstname: '',
    lastname: '',
    mobile: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (show && usertype) {
      setFormData((prev) => ({ ...prev, usertype }));
    }
  }, [show, usertype]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUserTypeChange = (e) => {
    const selectedType = e.target.value;
    setUsertype(selectedType);

    if (selectedType === "admin") {
      handleShowSignupAdmin();
    } else if (selectedType === "client") {
      handleShowSignupClient();
    } else if (selectedType === "advocate") {
      handleShowSignupAdvocate();
    }else if (selectedType === "jr.advocate") {
      handleShowSignupJrAdvocate()
  }
}

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!formData.usertype || !formData.firstname || !formData.lastname || !formData.mobile || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      alert("All fields are required")
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/signupAdmin`, formData);
      if (response.status === 201) { // Success
        alert("Signup successful! Redirecting to login...")
        handleClose()  // Close Signup Modal
        setModalType("login")  // Switch to Login Modal
        setShowModal(true)  // Open Login Modal
      }

    } catch (error) {
      alert(error.response?.data?.message || "Server error")
    }
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-centered custom-modal-signup p-0 border-0">
      <Modal.Header className="modal-header">
        <span className="close-btn" onClick={handleClose}>
          <img src={arrow} alt="arrow" width="20" height="auto" />
        </span>
      </Modal.Header>

      <Modal.Title className="text-center signup-heading">Sign Up Admin</Modal.Title>
      <Modal.Body>
        <Form onSubmit={handleSignUp}>
          <div className="modal-form">
            <Form.Group controlId="formUsertype" className="d-flex align-items-center mb-3">
              <div className="flex-column">
                <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                  User Type <span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Select
                  className="form-control-lg w-100"
                  value={formData.usertype}
                  onChange={handleUserTypeChange}
                  autoComplete="off"
                  name="usertype"
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="admin">Admin</option>
                  <option value="advocate">Advocate</option>
                  <option value="jr.advocate">Jr.Advocate</option>
                  <option value="client">Client</option>
                </Form.Select>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between gap-4">
              <Form.Group controlId="formFirstName" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>First Name <span className="text-danger ms-1">*</span></Form.Label>
                  <Form.Control
                    type='text'
                    name='firstname'
                    value={formData.firstname}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formLastName" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Last Name <span className="text-danger ms-1">*</span></Form.Label>
                  <Form.Control
                    type='text'
                    name='lastname'
                    value={formData.lastname}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>
            </div>

            <div className="d-flex justify-content-between gap-4">
              <Form.Group controlId="formMobile" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Mobile <span className="text-danger ms-1">*</span></Form.Label>
                  <Form.Control
                    type="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formEmail" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Email <span className="text-danger ms-1">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>
            </div>

            <Form.Group controlId="formUsername" className="d-flex align-items-center mb-3">
              <div className="flex-column">
                <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Username <span className="text-danger ms-1">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
            </Form.Group>

            <div className=" d-flex justify-content-between gap-4">
              <Form.Group controlId="formPassword" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    Password <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    // placeholder="Enter your password"
                    value={formData.password}  // This should be tied to password state
                    onChange={handleChange}  // Update password state
                    autoComplete="current-password"
                    className="form-control-sm"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    Confirm Password <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="Password"
                    name="confirmPassword"
                    // placeholder="Enter your password"
                    value={formData.confirmPassword}  // This should be tied to password state
                    onChange={handleChange}  // Update password state
                    autoComplete="current-password"
                    className="form-control-sm"
                    required
                  />
                </div>
              </Form.Group>
            </div>

            <span className="forgot-password-signup">Forgot Password?</span>
          </div>
          <center className="signup-click-padding">
            <Button className="loginButton" type="submit">Sign Up</Button>
          </center>
          <center className="click-padding">
            <span onClick={handleShowLogin}> Already a Member? <Link to="/api/users/login">Log In</Link> </span>
          </center>
        </Form>
      </Modal.Body>
    </Modal>
  );
}


export default SignupAdmin;
