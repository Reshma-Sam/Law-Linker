import React, { useState } from "react";
import Footer from "../Components/Footer";
import axios from "axios";

function LandingPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    advocateEmail: "",
    clientName: "",
    date: "",
    time: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${apiUrl}/client/book-appointment`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Appointment booked successfully!");
        setFormData({
          advocateEmail: "",
          clientName: "",
          date: "",
          time: "",
          subject: "",
          message: ""
        });
      } else {
        alert(response.data?.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert(error.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);  // Stop loading
    }
  };


  return (
    <>
      <div className="landing-page">
        <section>
          <div className="content">
            <h1>Law Linker</h1>
            <p>
              "We are here to assist you. If you have any legal queries, feel free to reach out. Our experts will
              guide you with the right advice and support to help you navigate your legal matters with confidence."
            </p>
          </div>
        </section>

        <section className="aboutContact">
          {/* About Section */}
          {/* -------------- */}
          <section id="about-section" className="aboutSection">
            <h1>About Us</h1>
            <p>
              At <strong>Law Linker</strong>, we provide expert legal guidance tailored to your needs. Our experienced
              professionals ensure accessible and reliable legal solutions.
            </p>

            <div className="aboutCards">
              <div className="card">
                <h2>Expert Lawyers</h2>
                <p>Our team consists of highly skilled and experienced legal professionals ready to assist you.</p>
              </div>
              <div className="card">
                <h2>Affordable Services</h2>
                <p>We offer transparent and budget-friendly legal consultations and support.</p>
              </div>
              <div className="card">
                <h2>Fast Legal Assistance</h2>
                <p>Quick and efficient legal solutions to ensure a hassle-free experience for our clients.</p>
              </div>
              <div className="card">
                <h2>Secure & Confidential</h2>
                <p>We ensure complete privacy and confidentiality for all legal matters.</p>
              </div>
              <div className="card">
                <h2>Personalized Legal Support</h2>
                <p>We tailor our legal guidance to your unique needs, ensuring you get the best solutions.</p>
              </div>
              <div className="card">
                <h2>24/7 Assistance</h2>
                <p>Our support team is available around the clock to help you with urgent legal matters.</p>
              </div>
            </div>

          </section>

          {/* Contact Section */}
          {/* ----------------- */}
          <section id="contact-section" className="contactSection">
            <h1>Contact Us</h1>
            <div className="contactInfo">
              <p>We are here to listen, support, and guide you through your legal journey.</p>
              <p>Whether you need expert advice, professional representation, or simply
                have questions, our team is dedicated to providing you with the best legal assistance.</p>
              <p>Your concerns matter to us, and we are committed to offering reliable
                and confidential legal solutions that bring clarity and confidence to your case.</p>
              <p className="contact-highlight">Reach out today, and let's work together toward justice and peace of mind.</p>
            </div>
          </section>


          {/* Contact Form */}
          {/* ------------- */}
          {/* Contact Form */}
          <section>
            <div className="contactForm">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Advocate Email <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    name="advocateEmail"
                    value={formData.advocateEmail}
                    onChange={handleChange}
                    className="contactInput"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Client Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="nameFields">
                  <div className="form-group">
                    <label>Date <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      min={new Date().toISOString().split("T")[0]}  // Prevent past dates
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time <span className="text-danger">*</span></label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message <span className="text-danger">*</span></label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <center>
                  <button className="loginButton" type="submit" disabled={loading}>
                    {loading ? "Booking..." : "Send"}
                  </button>
                </center>

              </form>
            </div>
          </section>

        </section>

        <Footer />

      </div >
    </>
  );
}

export default LandingPage;
