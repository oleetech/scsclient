import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl, isAdminLoggedIn, isEmployeeLoggedIn } from "../ApiUrlAndToken";
import LogoutIcon from "@mui/icons-material/Logout";
import { hoverScale } from "./DesignStandardize";
import { toast } from "react-toastify";

export const handleLogout = async () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }
  try {
    let data;
    if (isAdminLoggedIn) {
      data = { hashedRT: adminData.tokens.refreshToken };
    } else if (isEmployeeLoggedIn) {
      data = { hashedRT: userData.tokens.refreshToken };
    }
    await axios.post(
      `${apiUrl}/${isAdminLoggedIn ? "admin" : "user"}/logout`,
      data,
      {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      }
    );

    if (isEmployeeLoggedIn) {
      localStorage.removeItem("employee");
    } else if (isAdminLoggedIn) {
      localStorage.removeItem("admin");
    }
    toast.success("Logging out. You are redirecting to login page.");
    window.location.href = "/";
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error(
        "Token got expired for security issues. You are redirecting to login page."
      );
      window.location.href = "/";
    } else {
      console.error(error);
    }
  }
};
const LogOut = () => {
  return (
    <Link
      className={`px-1 pb-1 rounded text-xl hover:font-semibold mx-auto text-error hover:text-white hover:bg-error ${hoverScale}`}
      onClick={handleLogout}
    >
      <LogoutIcon /> Log out
    </Link>
  );
};

export default LogOut;
