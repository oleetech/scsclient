import React from "react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitButton } from "../../../components/DesignStandardize";
import GeneralInput from "../../../components/GeneralInput";
import { apiUrl } from "../../../ApiUrlAndToken";

const UserSignIn = () => {
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setPasswordUser] = useState("");

  //function for USER LOGIN
  const UserLogin = async (e) => {
    e.preventDefault();
    if (emailUser === "" || passwordUser === "") {
      toast.error("Please fill the required fields");
      return;
    }
    try {
      const data = {
        email: emailUser,
        password: passwordUser,
      };
      const response = await axios.post(`${apiUrl}/user/signin`, data);
      // console.log(response.data);

      if (response.status === 200) {
        localStorage.setItem("employee", JSON.stringify(response.data));

        toast.success("Successful Login");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        toast.error(`${error.response.data}`);
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
      onSubmit={UserLogin}
    >
      <GeneralInput
        label="User Email"
        labelSpanText="*"
        type="email"
        placeholder="Enter User Email"
        value={emailUser}
        onChange={(e) => {
          setEmailUser(e.target.value);
        }}
        required
      />

      <GeneralInput
        label="User Password"
        labelSpanText="*"
        type="password"
        placeholder="Enter User Password"
        value={passwordUser}
        onChange={(ev) => setPasswordUser(ev.target.value)}
        required
      />

      <button className={`${submitButton}`}>Sign In</button>
    </form>
  );
};

export default UserSignIn;
