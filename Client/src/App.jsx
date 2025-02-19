import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Routes, Route } from "react-router-dom"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";

// Importing Stripe Elements
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


// Importing  components
//-----------------------
import LandingPage from './Pages/LandingPage'
import GetLawyer from './Pages/GetLawyer'
import LoginModal from './Components/loginModal'
import SignupAdmin from './Components/SignupAdmin'
import SignupAdvocate from './Components/SignupAdvocate'
import SignupClient from './Components/SignupClient'
import NavigationBar from './Components/Navbar'
import Layout from './Pages/Layout'
import AdvocateList from './Pages/AdvocateList'
import SignupJrAdvocate from './Components/SignupJrAdvocate'
import AdvocateProfile from './Components/AdvocateProfile'
import AdminDashboard from './Pages/AdminDashboard'
import AdvocateDashboard from './Pages/AdvocateDashboard'
import AdminAdvocates from './Pages/AdminDashboard/AdminAdvocates'
import AdminJrAdvocated from './Pages/AdminDashboard/AdminJrAdvocated'
import AdminClients from './Pages/AdminDashboard/AdminClients'
import AdminCases from './Pages/AdminDashboard/AdminCases'
import ApprovalCase from './Pages/AdvocateDashboard/ClientList'
import CaseList from './Pages/AdvocateDashboard/CaseList'
import CreateCase from './Pages/AdvocateDashboard/CreateCase'
import CreateAdvocateAdmin from './Pages/AdminDashboard/CreateAdvocateAdmin'
import CreateJrAdvocateAdmin from './Pages/AdminDashboard/CreateJrAdvocateAdmin'
import CaseProfile from './Pages/CaseProfile'
import ClientProfile from './Components/ClientProfile'
import UpdateCaseForm from './Pages/AdvocateDashboard/UpdateCaseForm'
import ClientList from './Pages/AdvocateDashboard/ClientList'
import TrackPayment from './Pages/AdvocateDashboard/TrackPayment'
import ClientCases from './Pages/ClientDashBoard/ClientCases'
import ClientPayments from './Pages/ClientDashBoard/ClientPayments'
import ClientDashBoard from './Pages/ClientDashBoard'
import ApprovalAdvocates from './Pages/AdminDashboard/ApprovalAdvocates'
import AdvocateMessages from './Pages/AdvocateDashboard/AdvocateMessages'
import BookAppoinment from './Pages/ClientDashBoard/BookAppoinment'
import AdvocateAppointments from './Pages/AdvocateDashboard/AdvocateAppointments'
import PaymentSuccess from './Pages/PaymentSuccess'
import PaymentFailed from './Pages/PaymentFailed'
import PaymentForm from './Components/PaymentForm'
import JrAdvocateDashboard from './Pages/JrAdvocateDashboard'

function App() {
  const [isAuth, setAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("") // Track whether it's "login" or "signup"
  const [usertype, setUsertype] = useState("")
  const navigate = useNavigate()
  const [alertMessage, setAlertMessage] = useState("")

  // Initialize Stripe with your public key
  const stripePromise = loadStripe('pk_test_51QnKiAFCcQX52WfYG29fFIttnHJ6Hrk739AcawssdbJdtOKR6Ix4iQ39xleU24kfQzkS8s4xGVKBsZhO34QcWDUt004ZYivYbI');

  // Function to show the custom alert
  const triggerAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 3000)
  }

  const getLoggedInAdvocateEmail = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // console.warn("No token found in localStorage.");
      return null;
    }

    try {
      const decodedToken = jwtDecode(token);

      // Check if the token has expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.warn("Token has expired. Clearing localStorage.");
        localStorage.removeItem("token");
        return null;
      }

      return decodedToken.email || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };




  const loggedInUserEmail = getLoggedInAdvocateEmail()

  if (!loggedInUserEmail) {
    console.log("User email not found!");
  } else {
    console.log("Logged-in User Email:", loggedInUserEmail);
  }


  useEffect(() => {

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode token payload
        setAuth(true);
        setUser(decodedUser);
        // console.log("Auth state updated:", { isAuth: true, user: decodedUser })
      } catch (error) {
        // console.error("Invalid token:", error);
        localStorage.removeItem("token"); //
        localStorage.removeItem("user"); // 
        setAuth(false);
        setUser(null);
      }
    } else {
      // console.log("No valid token found, setting isAuth to false.")
      setAuth(false);
      setUser(null);
    }
  }, [isAuth]);


  // Modal control functions
  //------------------------

  const handleShowLogin = () => {
    setModalType("login")
    setShowModal(true)
  }

  const handleShowSignupAdmin = () => {
    setUsertype("admin")
    setModalType("signupAdmin")
    setShowModal(true)
  }

  const handleShowSignupAdvocate = () => {
    setUsertype("advocate")
    setModalType("signupAdvocate")
    setShowModal(true)
  }

  const handleShowSignupJrAdvocate = () => {
    setUsertype("jr.advocate")
    setModalType("signupJrAdvocate")
    setShowModal(true)
  }

  const handleShowSignupClient = () => {
    setUsertype("client")
    setModalType("signupClient")
    setShowModal(true)
  }

  // function to handle opening the  Advocate Modal creating by admin
  const handleShowCreateAdvocateAdmin = () => {
    setModalType("createAdvocateAdmin")
    setShowModal(true)
  }

  // function to handle opening the  Jr.Advocate Modal creating by admin
  const handleShowCreateJrAdvocateAdmin = () => {
    console.log("entering  into handleShowCreateJrAdvocateAdmin")
    setModalType("createJrAdvocateAdmin")
    setShowModal(true)
  }


  const handleClose = () => {
    setShowModal(false)
    setModalType("") // Reseting modal type
  }

  useEffect(() => {
    // console.log("Modal State Updated - showModal:", showModal, "modalType:", modalType)
  }, [showModal, modalType])


  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      setAuth(false);
      setUser(null);
      triggerAlert("Logged out successfully")
      navigate("/");

    } catch (error) {
      console.error(error)
      triggerAlert("Error logging out")
    }
  }

  return (
    <>
      <div className="d-flex flex-column min-vh-100">

        {/* Navbar Component */}
        <NavigationBar isAuth={isAuth} handleShowLogin={handleShowLogin} handleLogout={handleLogout} />

        {/* Main Container for Routes */}
        {/* ------------------------- */}

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Layout />}>

              <Route path='/' element={<LandingPage />} />
              <Route path='/getLawyers' element={<GetLawyer />} />
              <Route path="/advocates" element={<AdvocateList />} />
              <Route path="/profile/other/:userType/:id" element={<AdvocateProfile />} />
              <Route path="/profile-client/other/:userType/:id" element={<ClientProfile />} />


              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/advocate-dashboard" element={<AdvocateDashboard />} />
              <Route path="/jr.advocate-dashboard" element={<JrAdvocateDashboard />} />
              <Route path="/client-dashboard" element={<ClientDashBoard />} />

              {/* Admin-Specific Routes */}
              <Route path="/admin-advocates" element={<AdminAdvocates handleShowCreateAdvocateAdmin={handleShowCreateAdvocateAdmin} />} />
              <Route path="/admin-clients" element={<AdminClients />} />
              <Route path="/admin-jr-advocates" element={<AdminJrAdvocated handleShowCreateJrAdvocateAdmin={handleShowCreateJrAdvocateAdmin} />} />
              <Route path="/admin-cases" element={<AdminCases />} />
              <Route path="/pending-advocate" element={<ApprovalAdvocates />} />

              {/* Shared Advocate & Jr. Advocate Routes */}
              {/* <Route path="/advocate-list" element={<Advocate />} />/     */}
              <Route path="/create-case" element={<CreateCase />} />
              <Route path="/case-list" element={<CaseList />} />
              <Route path="/client-list" element={<ClientList advocateEmail={loggedInUserEmail}/>} />
              <Route path="/caseProfile/:caseId" element={<CaseProfile />} />
              <Route path="/updateCase/:caseId" element={<UpdateCaseForm />} />
              <Route path="/tracking" element={<TrackPayment advocateEmail={loggedInUserEmail} />} />
              <Route path="/advocate-messages" element={<AdvocateMessages advocateEmail={loggedInUserEmail} />} />
              <Route path="/advocate-appointments" element={<AdvocateAppointments />} />


              {/* Client Specific Routes */}
              <Route path="/client-cases" element={<ClientCases />} />
              <Route path="/client-payments" element={<Elements stripe={stripePromise}> <ClientPayments /></Elements>} />
              <Route path="/client-booking" element={<BookAppoinment />} />

              {/* Payment Specific Routes */}
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />
              <Route path="/payment-history" element={<PaymentForm />} />


            </Route>
          </Routes>
        </Container>
      </div>

      {/* Modal Component (conditionally rendered) */}
      {/* ----------------------------------------- */}
      {showModal && modalType === "login" && (
        <LoginModal show={showModal} handleClose={handleClose} setAuth={setAuth} handleShowSignupAdmin={handleShowSignupAdmin} />
      )}

      {showModal && modalType === "signupAdmin" && (
        <SignupAdmin show={showModal} usertype={usertype} setUsertype={setUsertype} handleClose={handleClose} setModalType={setModalType} setShowModal={setShowModal} setAuth={setAuth} handleShowLogin={handleShowLogin} handleShowSignupAdvocate={handleShowSignupAdvocate} handleShowSignupClient={handleShowSignupClient} handleShowSignupAdmin={handleShowSignupAdmin} handleShowSignupJrAdvocate={handleShowSignupJrAdvocate} />
      )}

      {showModal && modalType === "signupAdvocate" && (
        <SignupAdvocate show={showModal} usertype={usertype} setUsertype={setUsertype} handleClose={handleClose} setModalType={setModalType} setShowModal={setShowModal} setAuth={setAuth} handleShowLogin={handleShowLogin} handleShowSignupAdmin={handleShowSignupAdmin} handleShowSignupClient={handleShowSignupClient} handleShowSignupAdvocate={handleShowSignupAdvocate} handleShowSignupJrAdvocate={handleShowSignupJrAdvocate} />
      )}

      {showModal && modalType === "signupJrAdvocate" && (
        <SignupJrAdvocate show={showModal} usertype={usertype} setUsertype={setUsertype} handleClose={handleClose} setModalType={setModalType} setShowModal={setShowModal} setAuth={setAuth} handleShowLogin={handleShowLogin} handleShowSignupAdmin={handleShowSignupAdmin} handleShowSignupClient={handleShowSignupClient} handleShowSignupAdvocate={handleShowSignupAdvocate} handleShowSignupJrAdvocate={handleShowSignupJrAdvocate} />
      )}

      {showModal && modalType === "signupClient" && (
        <SignupClient show={showModal} usertype={usertype} setUsertype={setUsertype} handleClose={handleClose} setModalType={setModalType} setShowModal={setShowModal} setAuth={setAuth} handleShowLogin={handleShowLogin} handleShowSignupAdmin={handleShowSignupAdmin} handleShowSignupAdvocate={handleShowSignupAdvocate} handleShowSignupClient={handleShowSignupClient} handleShowSignupJrAdvocate={handleShowSignupJrAdvocate} />
      )}

      {showModal && modalType === "createAdvocateAdmin" && (
        <CreateAdvocateAdmin show={showModal} handleClose={handleClose} />
      )}

      {showModal && modalType === "createJrAdvocateAdmin" && (
        <CreateJrAdvocateAdmin show={showModal} handleClose={handleClose} />
      )}
    </>
  )
}


export default App
