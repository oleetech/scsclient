import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitButton } from "../../components/DesignStandardize";
import GeneralInput from "../../components/GeneralInput";
import { apiUrl } from "../../ApiUrlAndToken";

const AdminSigIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const AdminLogin = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill the required fields");
      return;
    }
    try {
      const data = {
        email,
        password,
      };
      const response = await axios.post(`${apiUrl}/admin/signin`, data);
      // console.log(response.data);

      if (response.status === 200) {
        localStorage.setItem("admin", JSON.stringify(response.data));

        toast.success("Successful Login");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        toast.error(`${error.response.data.message}`);
      } else if (error.request) {
        toast.error("No response received from the server");
      } else {
        toast.error("An error occurred while processing the request");
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-3 font-[Poppins] font-lato p-5 shadow-lg"
      onSubmit={AdminLogin}
    >
      <GeneralInput
        label="Admin Email"
        labelSpanText="*"
        type="email"
        placeholder="Enter Admin Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
      />

      <GeneralInput
        label="Admin Password"
        labelSpanText="*"
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <button className={`${submitButton}`}>Sign In</button>
    </form>
  );
};

export default AdminSigIn;
