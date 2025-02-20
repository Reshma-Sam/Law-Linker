import { React, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import arrow from "../Assets/Arrow.png";

function SignupJrAdvocate({ show, usertype, setUsertype, handleClose, setModalType, setShowModal, handleShowLogin, handleShowSignupAdvocate, handleShowSignupClient, handleShowSignupAdmin, handleShowSignupJrAdvocate }) {
    const apiUrl = import.meta.env.VITE_API_URL
    const [formData, setFormData] = useState({
        usertype: '',
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        username: '',
        barcodenumber: '',
        specialization: '',
        state: '',
        district: '',
        advocateemail: '',
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
            handleShowSignupClient()
        } else if (selectedType === "advocate") {
            handleShowSignupAdvocate()
        } else if (selectedType === "jr.advocate") {
            handleShowSignupJrAdvocate()
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!formData.usertype || !formData.firstname || !formData.lastname || !formData.mobile || !formData.email || !formData.barcodenumber || !formData.specialization || !formData.state || !formData.district || !formData.username || !formData.password || !formData.confirmPassword) {
            alert("All fields are required")
            return
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            return
        }

        try {
            const response = await axios.post(`${apiUrl}/advocate/signup`, formData);
            if (response.status === 201) { // Success
                alert("Signup successful! Redirecting to login...")
                handleClose(); // Close Signup Modal
                setModalType("login"); // Switch to Login Modal
                setShowModal(true); // Open Login Modal
            }

        } catch (error) {
            alert(error.response?.data?.message || "Server error");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-centered custom-modal-signup p-0 border-0">
            <Modal.Header className="modal-header">
                <span className="close-btn" onClick={handleClose}>
                    <img src={arrow} alt="arrow" width="20" height="auto" />
                </span>
            </Modal.Header>

            <Modal.Title className="text-center signup-heading">Sign Up Advocate</Modal.Title>
            <Modal.Body className="modal-body-scroll">
                <Form onSubmit={handleSignUp}>
                    <div className="modal-form">

                        <div className="d-flex justify-content-between gap-4">
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

                            <Form.Group controlId="formSpecialization" className="d-flex align-items-center mb-3">
                                <div className="flex-column">
                                    <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>
                                        Specialization <span className="text-danger ms-1">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        className="form-control-lg w-100"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        required
                                    >
                                        <option value="">Select Specialization</option>
                                        <option value="civil-debt">Civil / Debt Matters</option>
                                        <option value="cheque-bounce">Cheque Bounce</option>
                                        <option value="civil-litigation">Civil Litigation</option>
                                        <option value="consumer-court">Consumer Court</option>
                                        <option value="documentation">Documentation</option>
                                        <option value="recovery">Recovery</option>
                                        <option value="corporate-law">Corporate Law</option>
                                        <option value="arbitration">Arbitration</option>
                                        <option value="banking-finance">Banking / Finance</option>
                                        <option value="startup">Startup</option>
                                        <option value="tax">Tax</option>
                                        <option value="trademark-copyright">Trademark & Copyright</option>
                                        <option value="criminal-property">Criminal / Property</option>
                                        <option value="criminal-litigation">Criminal Litigation</option>
                                        <option value="cyber-crime">Cyber Crime</option>
                                        <option value="landlord-tenant">Landlord / Tenant</option>
                                        <option value="property">Property</option>
                                        <option value="revenue">Revenue</option>
                                        <option value="personal-family">Personal / Family</option>
                                        <option value="child-custody">Child Custody</option>
                                        <option value="divorce">Divorce</option>
                                        <option value="family-dispute">Family Dispute</option>
                                        <option value="labour-service">Labour & Service</option>
                                        <option value="medical-negligence">Medical Negligence</option>
                                        <option value="motor-accident">Motor Accident</option>
                                        <option value="muslim-law">Muslim Law</option>
                                        <option value="wills-trusts">Wills / Trusts</option>
                                        <option value="others">Others</option>
                                        <option value="armed-forces">Armed Forces Tribunal</option>
                                        <option value="immigration">Immigration</option>
                                        <option value="insurance">Insurance</option>
                                        <option value="international-law">International Law</option>
                                        <option value="notary">Notary</option>
                                        <option value="property-redevelopment">Property Redevelopment</option>
                                        <option value="supreme-court">Supreme Court</option>
                                    </Form.Select>
                                </div>
                            </Form.Group>
                        </div>

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
                                        type="text"
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

                            <Form.Group controlId="formBarcodeNumber" className="d-flex align-items-center mb-3">
                                <div className="flex-column">
                                    <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Bar Code <span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="barcodenumber"
                                        value={formData.barcodenumber}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </Form.Group>
                        </div>

                        <Form.Group controlId="formadvocateEmail" className="d-flex align-items-center mb-3">
                            <div className="flex-column">
                                <Form.Label className="me-3 fw-bold" style={{ minWidth: "100px" }}>Advocate Email<span className="text-danger ms-1">*</span></Form.Label>
                                <Form.Control
                                    type="email"
                                    name="advocateemail"
                                    value={formData.advocateemail}
                                    onChange={handleChange}
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
                                        type="confimPassword"
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
    )
}


export default SignupJrAdvocate