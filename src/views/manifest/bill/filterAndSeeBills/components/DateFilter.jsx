import React, { useState } from "react";
import GeneralInput from "../../../../../components/GeneralInput";
import {
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../../ApiUrlAndToken";
import { toast } from "react-toastify";
import ShowTable from "../helpers/ShowTable";
import { fetchBillsGeneric } from "../helpers/FetchBillsGeneric";

const DateFilter = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [manifests, setManifests] = useState([]);
  const fetchManifestsByDate = async (selectedDate) => {
    setManifests([]);
    try {
      setLoading(true);
      const updatedManifests = await fetchBillsGeneric(
        `getAll/${selectedDate}`
      );
      setManifests(updatedManifests);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(
          "Token got expired for security issues. You are redirecting to login page."
        );
        window.location.href = "/";
      } else {
        console.error(error);
      }
      setLoading(false);
    }
  };
  return (
    <>
      <GeneralInput
        label="Select Date"
        type="date"
        placeholder="mm/dd/yyyy"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          fetchManifestsByDate(e.target.value);
        }}
      />

      {loading && (
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid mx-auto" />
      )}
      {manifests.length > 0 ? (
        <ShowTable
          manifests={manifests}
          date={selectedDate}
          excelFileName={selectedDate}
        />
      ) : (
        <>
          {selectedDate && (
            <p className="text-slate-600 text-center">
              No bill has been generate for{" "}
              <span className="font-semibold">{selectedDate}</span>
            </p>
          )}
        </>
      )}
    </>
  );
};

export default DateFilter;
