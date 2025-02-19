import React from 'react'
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h4>About Us</h4>
          <p>We provide expert legal guidance tailored to your needs.</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/aboutUs">About</Link></li>
            <li><Link to="/getLawyers">Get Lawyer</Link></li>
            <li><Link to="/contactUs">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@lawlinker.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p style={{color:' #e3e0d9', paddingTop:"40px"}}>&copy; {new Date().getFullYear()} Law Linker. All Rights Reserved.</p>
      </div>
    </footer>

  )
}

export default Footer