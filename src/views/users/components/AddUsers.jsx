import React, { useState } from "react";
import GeneralInput from "../../../components/GeneralInput";
import { submitButton } from "../../../components/DesignStandardize";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl, isAdminLoggedIn } from "../../../ApiUrlAndToken";

const AddUsers = () => {
  let adminData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  }

  const [userName, SetUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userDesignation, setUserDesigntion] = useState("");

  const UserReg = async (e) => {
    e.preventDefault();
    if (!userEmail || !password || !userName || !userDesignation) {
      toast.error("Mandatory fields cannot be empty.");
      return;
    }
    try {
      const data = {
        email: userEmail,
        password: password,
        name: userName,
        designation: userDesignation.toUpperCase(),
      };
      // const response =
      await axios.post(`${apiUrl}/user`, data, {
        headers: {
          Authorization: `Bearer ${adminData.tokens.accessToken}`,
        },
      });

      toast.success("New User Has Been Added!!!");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(
          "Token got expired for security issues. You are redirecting to login page."
        );
        window.location.href = "/";
      } else if (error.response && error.response.status === 403) {
        toast.warning("Email already exists.");
      } else {
        toast.error("An error occurred while creating the User.");
      }
    }
  };

  return (
    <form className="flex flex-col gap-3 font-[Poppins]" onSubmit={UserReg}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GeneralInput
          label="Name"
          labelSpanText="*"
          type="text"
          placeholder="Enter User Name"
          value={userName}
          onChange={(ev) => SetUserName(ev.target.value)}
          required
        />

        <GeneralInput
          label="Email"
          labelSpanText="*"
          type="email"
          placeholder="Enter User Email"
          value={userEmail}
          onChange={(ev) => setUserEmail(ev.target.value)}
          required
        />

        <GeneralInput
          label="Designation"
          labelSpanText="*"
          type="text"
          placeholder="Enter User Designation"
          value={userDesignation}
          onChange={(ev) => setUserDesigntion(ev.target.value)}
          required
        />

        <GeneralInput
          label="Password"
          labelSpanText="*"
          type="password"
          placeholder="Enter User Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
        />
      </div>

      <button className={`${submitButton} mx-auto`}>User Register</button>
    </form>
  );
};

export default AddUsers;
