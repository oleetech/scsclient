import React, { useState } from "react";
import { submitButton } from "../../components/DesignStandardize";
import GeneralInput from "../../components/GeneralInput";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";

const EditSpxParcelRate = ({ info }) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [infos, setInfos] = useState({
    location: info.location,
    rate1: info.rate1,
    rate2: info.rate2,
  });

  const updateInfo = async (e) => {
    e.preventDefault();
    try {
      const data = {
        weight: info.weight,
        location: infos.location,
        rate1: parseFloat(infos.rate1),
        rate2: parseFloat(infos.rate2),
      };

      if (data.rate1 > 0 && data.rate2 > 0 && data.location !== "") {
        // const response =
        await axios.put(
          `${apiUrl}/parcelrate/update/${info.parcelrate_id}`,
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

        toast.success("Rates information has been updated successfully!");
      } else {
        toast.warning(
          "Parcel rates must be greater than 0 and Location can not be empty."
        );
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
    <form className="flex flex-col gap-3 font-[Poppins]" onSubmit={updateInfo}>
      <p className="text-center mx-auto font-semibold">For {infos.location}</p>
      <GeneralInput
        label="Location"
        type="text"
        placeholder="..."
        value={infos.location}
        onChange={(e) => {
          setInfos({ ...infos, location: e.target.value });
        }}
      />

      <GeneralInput
        label="1st KG"
        labelSpanText="*"
        type="number"
        placeholder="Cost for 1st KG"
        value={infos.rate1}
        onChange={(e) => {
          setInfos({ ...infos, rate1: e.target.value });
        }}
      />

      <GeneralInput
        label="Over 1st KG"
        labelSpanText="*"
        type="number"
        placeholder="Cost for Over 1st KG"
        value={infos.rate2}
        onChange={(e) => {
          setInfos({ ...infos, rate2: e.target.value });
        }}
      />
      <button className={`${submitButton} mx-auto`}>Update</button>
    </form>
  );
};

export default EditSpxParcelRate;
