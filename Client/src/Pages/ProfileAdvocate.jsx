import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Spinner } from "react-bootstrap"
import { Form, Button, Row, Col } from "react-bootstrap"

const ProfileAdvocate = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const { userType, id } = useParams()
  const [advocate, setAdvocate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    advocateEmail: "",
    firstname: "",
    lastname: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchAdvocate = async () => {
      if (!userType || !id) return;
      try {
        const response = await axios.get(`${apiUrl}/profile/${userType}/${id}`)
        setAdvocate(response.data.user)
        setFormData((prev) => ({
          ...prev,
          advocateEmail: response.data.user.email, // Auto-fill advocate email
        }));
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching advocate details")
      } finally {
        setLoading(false)
      }
    };

    fetchAdvocate()
  }, [userType, id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData)
    alert("Your message has been sent successfully!")
  };

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>
  if (error) return <p className="text-center text-danger">{error}</p>

  return (
    <div>
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={advocate.profilePicture || "https://dummyimage.com/200"}
          alt="Profile"
          className="profile-img"
        />
        <h2>{advocate.firstname} {advocate.lastname}</h2>
        <p className="specialization">{advocate.specialization}</p>
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        <p><strong>Email:</strong> {advocate.email}</p>
        <p><strong>Phone:</strong> {advocate.mobile}</p>
        <p><strong>License Number:</strong> {advocate.barcodenumber}</p>
        <p><strong>State:</strong> {advocate.state}</p>
        <p><strong>District:</strong> {advocate.district}</p>
      </div>

      {/* Contact Form */}
      {/* ------------- */}
      <section style={{paddingTop: "50px"}}>
        <div className="contactForm">
          <h3 style={{ color: "black", fontWeight: "bold" }}>Contact {advocate.firstname}</h3>
          <Form onSubmit={handleSubmit}>
            {/* Advocate Email - Read Only */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "black", fontWeight: "bold" }}>
                Advocate Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="advocateEmail"
                value={formData.advocateEmail}
                readOnly
              />
            </Form.Group>

            {/* First Name & Last Name (Side by Side) */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "black", fontWeight: "bold" }}>
                    First Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "black", fontWeight: "bold" }}>
                    Last Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Subject */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "black", fontWeight: "bold" }}>
                Subject <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Message */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "black", fontWeight: "bold" }}>
                Message <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <div className="text-center">
              <Button variant="dark" type="submit">Send</Button>
            </div>
          </Form>
        </div>
      </section>
    </div>
    </div>
  );
};

export default ProfileAdvocate;
