import { React, useState, useEffect } from "react"
import { Modal, Button, Form, FormGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import arrow from "../Assets/Arrow.png"
import axios from "axios"

function SignupClient({ show, usertype, setUsertype, handleClose, setModalType, setShowModal, handleShowLogin, handleShowSignupAdmin, handleShowSignupClient, handleShowSignupAdvocate, handleShowSignupJrAdvocate }) {
  const apiUrl = import.meta.env.VITE_API_URL
  const [formData, setFormData] = useState({
    usertype: '',
    clientname: '',
    mobile: '',
    email: '',
    state: '',
    district: '',
    username: '',
    advocateEmail: '',
    password: '',
    confirmPassword: ''
  })

  // Update usertype when modal opens
  useEffect(() => {
    setFormData((prev) => ({ ...prev, usertype }));
  }, [usertype])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target   // Taking values entered on textbox
    setFormData({
      ...formData,                                // Adding these values to formData (state variable) using spread operator
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleUserTypeChange = (e) => {
    const selectedType = e.target.value;
    setUsertype(selectedType)
    console.log("selectedtype:", selectedType)

    if (selectedType === "admin") { // If Advocate/Jr. Advocate is selected
      handleShowSignupAdmin()
    } else if (selectedType === "advocate") {
      handleShowSignupAdvocate()
    } else if (selectedType === "client") {
      handleShowSignupClient()
    } else if (selectedType === "jr.advocate") {
      handleShowSignupJrAdvocate()
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("hai")
    if (!formData.usertype || !formData.clientname || !formData.mobile || !formData.email || !formData.username || !formData.state || !formData.district || !formData.password || !formData.confirmPassword) {
      alert("All fields are required")
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const response = await axios.post(`${apiUrl}/client/signupClient`, formData)
      console.log("Response from server:", response)
      if (response.status === 200) { // Success
        alert("Signup successful! Redirecting to login...")
        handleClose()  // Close Signup Modal
        setModalType("login")  // Switch to Login Modal
        setShowModal(true)  // Open Login Modal
      }

    } catch (error) {
      console.log("Error from client side:", error)
      alert(error.response?.data?.message || "Server error on client")
    }
  }
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-centered custom-modal-signup p-0 border-0">
      <Modal.Header className="modal-header">
        <span className="close-btn" onClick={handleClose}>
          <img src={arrow} alt="arrow" width="20" height="auto" />
        </span>
      </Modal.Header>

      <Modal.Title className="text-center signup-heading">Sign Up Client</Modal.Title>
      <Modal.Body>
        <Form onSubmit={handleSignUp}>
          <div className="modal-form">

            <div className=" d-flex justify-content-between gap-4">
              <Form.Group controlId="formUsertype" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    User Type <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Select
                    className="form-control-lg w-100"  // For making the width of input field 100%
                    value={formData.usertype}
                    name="usertype"
                    onChange={handleUserTypeChange}
                    autoComplete="off"
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

              <Form.Group controlId="formClientName" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Full Name <span className="text-danger ms-1">*</span></Form.Label>
                  <Form.Control
                    type='text'
                    name='clientname'
                    // placeholder='First Name'
                    value={formData.clientname}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>
            </div>

            <div className=" d-flex justify-content-between gap-4">
              <Form.Group controlId="formMobile" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    Mobile <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="mobile"
                    name="mobile"
                    // placeholder="Enter your mobile"
                    value={formData.mobile}  // This should be tied to email state
                    onChange={handleChange}  // Update email state
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formEmail" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    Email <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    // placeholder="Enter your email"
                    value={formData.email}  // This should be tied to email state
                    onChange={handleChange}  // Update email state
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>
            </div>

            <div className=" d-flex justify-content-between gap-4">
              <Form.Group controlId="formState" className="flex-grow-1">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    State <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Select
                    value={formData.state}
                    name="state"
                    onChange={handleChange}
                    autoComplete="off"
                    className="form-control-sm"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil nadu">Tamil Nadu</option>
                    <option value="Bangalore">Bangalore</option>
                  </Form.Select>
                </div>
              </Form.Group>

              <Form.Group controlId="formDistrict" className="flex-grow-1">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    District <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Select
                    className="form-control-sm w-100"  // For making the width of input field 100%
                    value={formData.district}
                    name="district"
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  >
                    <option value="">Select District</option>
                    <option value="thrissur">Thrissur</option>
                    <option value="Eranakulam">Eranakulam</option>
                    <option value="Kollam">Kollam</option>
                    <option value="Thrivandrum">Thrivandrum</option>
                    <option value="Pathanamthitta">Pathanamthitta</option>
                    <option value="Alapuzha">Alapuzha</option>
                    <option value="Iduki">Iduki</option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Kasaragod">Kasaragod</option>
                    <option value="Vayanad">Vayanad</option>
                    <option value="Malapuram">Malapuram</option>
                    <option value="Kannur">Kannur</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </div>

            <div className=" d-flex justify-content-between gap-4">
              <Form.Group controlId="formUsername" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    User Name <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    // placeholder="Enter your email"
                    value={formData.username}  // This should be tied to email state
                    onChange={handleChange}  // Update email state
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formAdvocateEmail" className="d-flex align-items-center mb-3">
                <div className="flex-column">
                  <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                    Advocate Email <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="advocateEmail"
                    // placeholder="Enter your email"
                    value={formData.advocateEmail}  // This should be tied to email state
                    onChange={handleChange}  // Update email state
                    autoComplete="off"
                    required
                  />
                </div>
              </Form.Group>
            </div>

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
                    required
                  />
                </div>
              </Form.Group>
            </div>

            <span className="forgot-password-signup">Forgot Password?</span>
          </div>
          <center className="signup-click-padding">
            <Button className="loginButton" type="submit">
              Sign Up
            </Button>
          </center>
          <center className="click-padding">
            <span onClick={handleShowLogin} > Already Member? <Link to="/api/users/login">Log In</Link> </span>
          </center>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default SignupClient



