import React, { useState } from "react";
import { submitButton } from "../../../components/DesignStandardize";
import GeneralInput from "../../../components/GeneralInput";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";

const EditEachLocation = ({ info }) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [infos, setInfos] = useState({
    location_from: info.location_from,
    location_to: info.location_to,
    rate_1: info.rate_1,
    rate_2: info.rate_2,
    rate_3: info.rate_3,
  });

  const updateLocationInfo = async (e) => {
    e.preventDefault();
    try {
      const data = {
        location_from: infos.location_from,
        location_to: infos.location_to,
        rate_1: parseFloat(infos.rate_1),
        rate_2: parseFloat(infos.rate_2),
        rate_3: parseFloat(infos.rate_3),
      };
      if (
        data.location_from !== "" &&
        data.location_to !== "" &&
        data.rate_1 > 0 &&
        data.rate_2 > 0 &&
        data.rate_3 > 0
      ) {
        // const response =
        await axios.put(
          `${apiUrl}/location-rate/updateLocationRate/${info.locationRate_id}`,
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

        toast.success("Location information has been updated successfully!");
      } else {
        toast.warning(
          "Rates must be greater than 0 and Locations can not be empty."
        );
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
      className="flex flex-col gap-3 font-[Poppins]"
      onSubmit={updateLocationInfo}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GeneralInput
          label="From"
          labelSpanText="*"
          type="text"
          placeholder="From"
          value={infos.location_from}
          onChange={(e) => {
            setInfos({ ...infos, location_from: e.target.value });
          }}
        />

        <GeneralInput
          label="To"
          labelSpanText="*"
          type="text"
          placeholder="To"
          value={infos.location_to}
          onChange={(e) => {
            setInfos({ ...infos, location_to: e.target.value });
          }}
        />

        <GeneralInput
          label="1st KG"
          labelSpanText="*"
          type="number"
          placeholder="Cost for 1st KG"
          value={infos.rate_1}
          onChange={(e) => {
            setInfos({ ...infos, rate_1: e.target.value });
          }}
        />

        <GeneralInput
          label="Over 1st KG"
          labelSpanText="*"
          type="number"
          placeholder="Cost for Over 1st KG"
          value={infos.rate_2}
          onChange={(e) => {
            setInfos({ ...infos, rate_2: e.target.value });
          }}
        />
        <GeneralInput
          label="Over 50 KG"
          labelSpanText="*"
          type="number"
          placeholder="Cost for Over 50 KG"
          value={infos.rate_3}
          onChange={(e) => {
            setInfos({ ...infos, rate_3: e.target.value });
          }}
        />
      </div>

      <button className={`${submitButton} mx-auto`}>Update</button>
    </form>
  );
};

export default EditEachLocation;
