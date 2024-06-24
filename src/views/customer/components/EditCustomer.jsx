import React, { useState } from "react";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { submitButton } from "../../../components/DesignStandardize";
import GeneralInput from "../../../components/GeneralInput";
import { toast } from "react-toastify";

const EditCustomer = ({ info }) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [name, setName] = useState(info.name);

  const updateInfo = async (e) => {
    e.preventDefault();
    try {
      const data = { name: name };
      if (data.name !== "") {
        await axios.patch(`${apiUrl}/customer/${info.customerid}`, data, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
        toast.success("Information has been updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        toast.error("Customer name can not be empty.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(
          "Token got expired for security issues. You are redirecting to login page."
        );
        window.location.href = "/";
      } else {
        toast.error(`${error.response.data.message}`);
      }
    }
  };
  return (
    <form
      className="flex flex-col gap-3 items-center w-full mt-auto md:mr-auto font-semibold font-Inter text-sm text-left md:text-base"
      onSubmit={updateInfo}
    >
      <GeneralInput
        label="Customer Name"
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button className={`${submitButton}`}>Update</button>
    </form>
  );
};

export default EditCustomer;
