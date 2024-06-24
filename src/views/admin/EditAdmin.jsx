import React, { useState } from "react";
import GeneralInput from "../../components/GeneralInput";
import { submitButton } from "../../components/DesignStandardize";
import axios from "axios";
import { apiUrl, isAdminLoggedIn } from "../../ApiUrlAndToken";
import { toast } from "react-toastify";

const EditAdmin = ({ info }) => {
  const [data, setData] = useState({
    email: info.email,
    name: info.name,
    password: "123456",
  });

  let adminData = JSON.parse(window.localStorage.getItem("admin"));

  const updateInfo = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        email: data.email,
        name: data.name,
        password: data.password,
      };
      if (dataToSend.password) {
        // const response =
        await axios.patch(
          `${apiUrl}/admin/updateAdmin/${info.adminid}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${adminData.tokens.accessToken}`,
            },
          }
        );
        console.log(dataToSend);
        toast.success("Information updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("Please enter your password!");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        toast.error(
          "Token got expired for security issues. You are redirecting to login page."
        );
        window.location.href = "/";
      } else if (error.response) {
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
      className="flex flex-col gap-3 items-center w-full mt-auto md:mr-auto font-semibold font-Inter text-sm text-left md:text-base"
      onSubmit={updateInfo}
    >
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> */}
      <GeneralInput
        label="Email"
        type="email"
        placeholder="Enter Email"
        value={data.email}
        onChange={(e) => {
          setData({ ...data, email: e.target.value });
        }}
      />
      <GeneralInput
        label="Name"
        type="text"
        placeholder="Enter Name"
        value={data.name}
        onChange={(e) => {
          setData({ ...data, name: e.target.value });
        }}
      />

      {/* <GeneralInput
          label="Image"
          id="Photo"
          name="Photo"
          type="file"
          onChange={(e) => setPicture(e.target.files[0])}
        /> */}

      <div>
        <GeneralInput
          label="Password"
          type="password"
          placeholder="Enter Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <p className="w-60 font-light text-slate-400 text-sm mt-2">
          Password is set to "123456" by default
        </p>
        {/* </div> */}
      </div>
      {isAdminLoggedIn && <button className={`${submitButton}`}>Update</button>}
    </form>
  );
};

export default EditAdmin;
