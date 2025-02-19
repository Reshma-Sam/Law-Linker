import React from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout = () => {
  return (
    <div className="d-flex flex-column">
      <main className="flex-grow-1">
        <Outlet /> {/* This renders the page content dynamically */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
