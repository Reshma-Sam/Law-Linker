import { React, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import arrow from '../../Assets/Arrow.png'

function CreateAdvocateAdmin({ show, handleClose }) {
    const apiUrl = import.meta.env.VITE_API_URL

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        mobile: "",
        email: "",
        username: "",
        barcodenumber: "",
        specialization: "",
        state: "",
        district: "",
        password: "",
        confirmPassword: "",
        usertype:"advocate"
    });
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!formData.usertype || !formData.firstname || !formData.lastname || !formData.mobile || !formData.email || !formData.barcodenumber || !formData.specialization || !formData.state || !formData.district || !formData.username || !formData.password || !formData.confirmPassword) {
            alert("All fields are required");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const token = localStorage.getItem("token"); // Fetch the token from storage
        if (!token) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        console.log("Submitting Advocate Data:", formData)

        try {
            const response = await axios.post(`${apiUrl}/auth/createAdvocate`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`, // Attach token to request
                    "Content-Type": "application/json"
                }
            });

            console.log("Server Response:", response.data)

            if (response.status === 201) {
                alert("Advocate created successfully!");
                handleClose();
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

            <Modal.Title className="text-center signup-heading">Create Advocate</Modal.Title>
            <Modal.Body>
                <Form onSubmit={handleSignUp} className="modal-form">
                    <div className="d-flex justify-content-between gap-4">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">First Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">Last Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
                        </Form.Group>
                    </div>

                    <div className="d-flex justify-content-between gap-4">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">Mobile <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </Form.Group>
                    </div>

                    <div className="d-flex justify-content-between gap-4">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">Username <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">Bar Code Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="barcodenumber" value={formData.barcodenumber} onChange={handleChange} required />
                        </Form.Group>
                    </div>

                    <Form.Group>
                        <Form.Label className="fw-bold">Specialization <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            className="form-control-lg w-100"
                            value={formData.specialization}
                            name="specialization"
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
                    </Form.Group>

                    <div className="d-flex justify-content-between gap-4">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">State <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={formData.state}
                                name="state"
                                onChange={handleChange}
                                autoComplete="off"
                                className="form-control-sm"
                                required
                            >
                                <option value="">Select State</option>
                                <option value="admin">Kerala</option>
                                <option value="advocate">Tamil Nadu</option>
                                <option value="client">Bangalore</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">District <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                className="form-control-sm w-100"  // For making the width of input field 100%
                                value={formData.district}
                                name="district"
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            >
                                <option value="">Select District</option>
                                <option value="admin">Thrissur</option>
                                <option value="advocate">Eranakulam</option>
                                <option value="client">Kollam</option>

                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className="d-flex justify-content-between gap-4">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">Password <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="flex-grow-1">
                            <Form.Label className="fw-bold">Confirm Password <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </Form.Group>
                    </div>

                    <center className="signup-click-padding">
                        <Button className="loginButton" type="submit">Create Advocate</Button>
                    </center>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CreateAdvocateAdmin;
