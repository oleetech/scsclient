import React, { useState } from "react";
import { apiUrl } from "../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from "../../assests/Logo.png";
import GeneralInput from "../../components/GeneralInput";
import { submitButton } from "../../components/DesignStandardize";

const AdminReg = () => {
  const [name, SetName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const AdminReg = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email: email,
        password: password,
        name: name,
      };
      // const response =
      await axios.post(`${apiUrl}/admin`, data);

      // console.log("Admin created:", response.data);

      toast.success("Admin Registration Done Successfully!!!");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      // Handle error
      if (error.response && error.response.status === 403) {
        toast.warning("Email already exists.");
      } else {
        toast.error("An error occurred while creating the admin.");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-3 items-center justify-center bg-white">
      <img src={Logo} alt="SCS Express" className="h-[100px] mb-5" />

      <p className="text-xl text-orange-600 font-medium">Admin Registration</p>

      <form
        className="flex flex-col gap-3 font-[Poppins] font-lato p-5 shadow-lg"
        onSubmit={AdminReg}
      >
        <GeneralInput
          label="New Admin Name"
          labelSpanText="*"
          type="text"
          placeholder="Enter Admin Name"
          value={name}
          onChange={(ev) => SetName(ev.target.value)}
        />

        <GeneralInput
          label="New Admin Email"
          labelSpanText="*"
          type="email"
          placeholder="Enter Admin Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />

        <GeneralInput
          label="New Admin Password"
          labelSpanText="*"
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />

        {name !== "" && email !== "" && password !== "" && (
          <button className={`${submitButton}`}>Admin Register</button>
        )}
      </form>
    </div>
  );
};

export default AdminReg;
