import React, { useState } from "react";
import GeneralInput from "../../../components/GeneralInput";
import { submitButton } from "../../../components/DesignStandardize";
import { toast } from "react-toastify";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";

const EditUSDtoBDT = ({ info }) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [bdt, setBdt] = useState(info.bdt_value);

  const updateConversion = async (e) => {
    e.preventDefault();
    try {
      const data = {
        bdt_value: parseFloat(bdt),
        month: info.month,
        year: info.year,
      };
      if (data.bdt_value > 0) {
        // const response =
        await axios.put(
          `${apiUrl}/conversion-bdt/update-conversion-rate/${info.conversionID}`,
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
        toast.success("Information updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("The USD to BDT convertion rate should be greater than 0.");
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
    <form className="flex flex-col gap-3" onSubmit={updateConversion}>
      <div className="flex gap-2 items-center">
        <p className="text-lg mt-2">
          <span className="font-bold">1</span> USD =
        </p>
        <GeneralInput
          type="number"
          value={bdt}
          onChange={(e) => setBdt(e.target.value)}
        />
        <span className="mt-2">BDT</span>
      </div>
      <button className={`${submitButton} mx-auto`}>Update</button>
    </form>
  );
};

export default EditUSDtoBDT;
