import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GeneralInput from "../../../components/GeneralInput";
import {
  generalInputField,
  monthNames,
  submitButton,
} from "../../../components/DesignStandardize";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";

const AddUSDtoBDT = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [bdt, setBdt] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract month and year from selected date
    const month = selectedDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
    const year = selectedDate.getFullYear();

    try {
      const data = {
        bdt_value: parseFloat(bdt),
        month: month,
        year: year,
      };
      // const response =
      await axios.post(`${apiUrl}/conversion-bdt`, data, {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      });

      toast.success("New USD to BDT rate added successfully!!!");

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
        toast.warning(`Conversion of ${monthNames[month - 1]},${year} exists`);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <GeneralInput
        label={`1 USD = ${parseFloat(bdt)} BDT`}
        type="number"
        value={bdt}
        onChange={(e) => setBdt(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <label>Month and Year</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM, yyyy"
          showMonthYearPicker
          className={`${generalInputField}`}
        />
      </div>
      <button className={`${submitButton} mx-auto`}>Add</button>
    </form>
  );
};

export default AddUSDtoBDT;
