import React, { useState } from "react";
import GeneralInput from "../../../components/GeneralInput";
import { submitButton } from "../../../components/DesignStandardize";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import { toast } from "react-toastify";

const EditUser = ({ info }) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }
  const [datas, setDatas] = useState({
    email: info.email,
    name: info.name,
    designation: info.designation,
    password: "123456",
  });

  const updateInfo = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email: String(datas.email),
        name: String(datas.name),
        designation: String(datas.designation.toUpperCase()),
        password: datas.password,
      };
      if (data.password) {
        console.log(typeof info.userid);
        const response = await axios.put(
          `${apiUrl}/user/update-user/${info.userid}`,
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
        toast.success("Information has been updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("Please enter your password!");
      }
    } catch (error) {
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
      <GeneralInput
        label="Email"
        type="email"
        placeholder="Enter Email"
        value={datas.email}
        onChange={(e) => {
          setDatas({ ...datas, email: e.target.value });
        }}
      />
      <GeneralInput
        label="Name"
        type="text"
        placeholder="Enter Name"
        value={datas.name}
        onChange={(e) => {
          setDatas({ ...datas, name: e.target.value });
        }}
      />
      <GeneralInput
        label="Designation"
        type="text"
        placeholder="Enter Designation"
        value={datas.designation}
        onChange={(e) => {
          setDatas({ ...datas, designation: e.target.value });
        }}
      />
      <div>
        <GeneralInput
          label="Password"
          type="password"
          placeholder="Enter Password"
          value={datas.password}
          onChange={(e) => {
            setDatas({ ...datas, password: e.target.value });
          }}
        />
        <p className="w-60 font-light text-slate-400 text-sm mt-2">
          Password is set to "123456" by default
        </p>
      </div>
      <button className={`${submitButton}`}>Update</button>
    </form>
  );
};

export default EditUser;
