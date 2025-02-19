import { useState, React, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../Assets/logo-law.png";

const NavigationBar = ({ isAuth, handleShowLogin, handleLogout }) => {
  const [authenticated, setAuthenticated] = useState(isAuth);
  const [userType, setUserType] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthenticated(isAuth);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && isAuth) {
      setUserType(storedUser.usertype);
    } else {
      setUserType(null); // Ensure userType is cleared on logout
    }
  }, [isAuth]);

  const handleScrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { replace: true });
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  };

  return (
    <Navbar expand="lg" className="shadow-sm sticky-navbar">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="no-hover">
          <img src={logo} alt="Law-Linker Logo" width="140" height="auto" />
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="navbar-nav" className="ms-auto" />

        <Navbar.Collapse id="navbar-nav" className="w-100">
          <Nav className="ms-auto text-center nav-links d-flex flex-wrap justify-content-center gap-2">
            {/* Common Navigation Links (Visible to Everyone) */}
            <Nav.Link as={Link} to="/getLawyers" className={location.pathname === "/getLawyers" ? "active-link" : ""}>
              Get Lawyers
            </Nav.Link>
            <Nav.Link as="a" href="#about" className={location.pathname === "/about" ? "active-link" : ""}
              onClick={(e) => { e.preventDefault(); handleScrollToSection("about-section") }}>
              About Us
            </Nav.Link>
            <Nav.Link as="a" href="#contact" className={location.pathname === "/contact" ? "active-link" : ""}
              onClick={(e) => { e.preventDefault(); handleScrollToSection("contact-section") }}>
              Contact Us
            </Nav.Link>

            {/* Authenticated User Navigation */}
            {authenticated && userType === "admin" && (
              <>
                <Nav.Link as={Link} to="/admin-dashboard" className={location.pathname === "/admin-dashboard" ? "active-link" : ""}>Admin</Nav.Link>
                <Nav.Link as={Link} to="/admin-advocates" className={location.pathname === "/admin-advocates" ? "active-link" : ""}>Advocates</Nav.Link>
                <Nav.Link as={Link} to="/admin-clients" className={location.pathname === "/admin-clients" ? "active-link" : ""}>Clients</Nav.Link>
                <Nav.Link as={Link} to="/admin-jr-advocates" className={location.pathname === "/admin-jr-advocates" ? "active-link" : ""}>Jr. Advocates</Nav.Link>
                <Nav.Link as={Link} to="/admin-cases" className={location.pathname === "/admin-cases" ? "active-link" : ""}>Cases</Nav.Link>
                <Nav.Link as={Link} to="/pending-advocate" className={location.pathname === "/pending-advocate" ? "active-link" : ""}>Approval</Nav.Link>
              </>
            )}

            {authenticated && userType === "advocate" && (
              <>
                <Nav.Link as={Link} to="/advocate-dashboard" className={location.pathname === "/advocate-dashboard" ? "active-link" : ""}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/create-case" className={location.pathname === "/create-case" ? "active-link" : ""}>Create Case</Nav.Link>
                <Nav.Link as={Link} to="/case-list" className={location.pathname === "/case-list" ? "active-link" : ""}>Case List</Nav.Link>
                <Nav.Link as={Link} to="/client-list" className={location.pathname === "/client-list" ? "active-link" : ""}>Client List</Nav.Link>
                <Nav.Link as={Link} to="/tracking" className={location.pathname === "/tracking" ? "active-link" : ""}>Track Payment</Nav.Link>
                <Nav.Link as={Link} to="/advocate-messages" className={location.pathname === "/advocate-messages" ? "active-link" : ""}>Messages</Nav.Link>
                <Nav.Link as={Link} to="/advocate-appointments" className={location.pathname === "/advocate-appointments" ? "active-link" : ""}>Appointments</Nav.Link>
              </>
            )}
            { authenticated &&  userType === "jr.advocate" && (
              <>
                <Nav.Link as={Link} to="/jr.advocate-dashboard" className={location.pathname === "/jr.advocate-dashboard" ? "active-link" : ""}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/create-case" className={location.pathname === "/create-case" ? "active-link" : ""}>Create Case</Nav.Link>
                <Nav.Link as={Link} to="/case-list" className={location.pathname === "/case-list" ? "active-link" : ""}>Case List</Nav.Link>
                <Nav.Link as={Link} to="/client-list" className={location.pathname === "/client-list" ? "active-link" : ""}>Client List</Nav.Link>
                <Nav.Link as={Link} to="/tracking" className={location.pathname === "/tracking" ? "active-link" : ""}>Track Payment</Nav.Link>
                <Nav.Link as={Link} to="/advocate-messages" className={location.pathname === "/advocate-messages" ? "active-link" : ""}>Messages</Nav.Link>
                <Nav.Link as={Link} to="/advocate-appointments" className={location.pathname === "/advocate-appointments" ? "active-link" : ""}>Appointments</Nav.Link>
              </>
            )}

            {authenticated && userType === "client" && (
              <>
                <Nav.Link as={Link} to="/client-dashboard" className={location.pathname === "/client-dashboard" ? "active-link" : ""}>Client Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/client-cases" className={location.pathname === "/client-cases" ? "active-link" : ""}>My Cases</Nav.Link>
                <Nav.Link as={Link} to="/client-payments" className={location.pathname === "/client-payments" ? "active-link" : ""}>Payments</Nav.Link>
                <Nav.Link as={Link} to="/client-booking" className={location.pathname === "/client-booking" ? "active-link" : ""}>Booking Appoinments</Nav.Link>
              </>
            )}
          </Nav>

          {/* Show Login if not authenticated, otherwise show Logout */}
          <Nav className="no-hover">
            {authenticated ? (
              <Button className="loginButton" onClick={() => {
                handleLogout();
                setUserType(null); // Clear userType on logout
                localStorage.removeItem("user"); // Remove user data
              }}>LogOut</Button>
            ) : (
              <Button className="loginButton" onClick={handleShowLogin}>Login</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
