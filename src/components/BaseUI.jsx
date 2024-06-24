import React from "react";
import { allFirstDiv, allSecondDiv } from "./DesignStandardize";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import TopNavbar from "./TopNavbar";
import FloatingButton from "./FloatingButton";
import { isAdminLoggedIn, isEmployeeLoggedIn } from "../ApiUrlAndToken";

const BaseUI = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" &&
      location.pathname !== "/add-admin" &&
      location.pathname !== "/scs-express-handle-admin" &&
      (isAdminLoggedIn || isEmployeeLoggedIn) ? (
        <>
          <Navbar />
          <TopNavbar />
          <div className={`${allFirstDiv}`}>
            <div className={`${allSecondDiv}`}>{children}</div>
            <div className="h-4" />
          </div>
          <FloatingButton />
        </>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
};

export default BaseUI;
