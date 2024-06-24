import React, { useState, useEffect } from "react";
import Logo from "../../assests/Logo.png";
import { isAdminLoggedIn, isEmployeeLoggedIn } from "../../ApiUrlAndToken";
import AdminSigIn from "../admin/AdminSigIn";
import UserSignIn from "../users/components/UserSignIn";

const Auth = () => {
  const [loading, setLoading] = useState(true);
  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };
  useEffect(() => {
    if (isEmployeeLoggedIn) {
      localStorage.removeItem("employee");
    } else if (isAdminLoggedIn) {
      localStorage.removeItem("admin");
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col gap-3 items-center justify-center bg-white">
      {loading ? (
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid" />
      ) : (
        <>
          <img src={Logo} alt="SCS Express" className="h-[150px] mb-5" />
          <div
            role="tablist"
            className="tabs tabs-lifted text-[28px] mb-3 w-max mx-auto font-bold"
          >
            <p
              role="tab"
              className={`tab  ${toggleState === 1 && "tab-active"}`}
              onClick={() => {
                changeTab(1);
              }}
            >
              Admin
            </p>
            <p
              role="tab"
              className={`tab ${toggleState === 2 && "tab-active"}`}
              onClick={() => {
                changeTab(2);
              }}
            >
              Employee
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-col gap-3 items-center">
            {toggleState === 1 ? <AdminSigIn /> : <UserSignIn />}
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
