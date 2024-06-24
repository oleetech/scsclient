import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../../ApiUrlAndToken";
import { toast } from "react-toastify";
import { monthNames } from "../../../../../components/DesignStandardize";
import GeneralSelect from "../../../../../components/GeneralSelect";
import ShowTable from "../helpers/ShowTable";
import { fetchBillsGeneric } from "../helpers/FetchBillsGeneric";

const MonthYearFilter = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [loading, setLoading] = useState(false);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [monthYearOptions, setMonthYearOptions] = useState([]);
  useEffect(() => {
    const getMonthYear = async () => {
      try {
        const response = await axios.get(`${apiUrl}/upload/month-year-list`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
        const formattedOptions = response.data.map((item) => ({
          label: `${monthNames[item.month - 1]}, ${item.year}`,
          value: item,
        }));
        setMonthYearOptions(formattedOptions);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error(
            "Token got expired for security issues. You are redirecting to login page."
          );
          window.location.href = "/";
        } else {
          console.error(error);
        }
      }
    };
    getMonthYear();
  }, []);

  const [manifests, setManifests] = useState([]);
  const fetchManifestsByMonthYear = async (selectedMonthYear) => {
    setManifests([]);
    try {
      setLoading(true);

      const updatedManifests = await fetchBillsGeneric(
        `getAll/${selectedMonthYear.month}/${selectedMonthYear.year}`
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
      <GeneralSelect
        options={monthYearOptions}
        label="Select Month and Year"
        placeholder="..."
        onChange={(selectedOption) => {
          setSelectedMonthYear(selectedOption.value);
          fetchManifestsByMonthYear(selectedOption.value);
        }}
        value={
          monthYearOptions.find(
            (option) => option.value === selectedMonthYear
          ) || ""
        }
      />

      {loading && (
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid mx-auto" />
      )}

      {manifests.length > 0 ? (
        <ShowTable
          manifests={manifests}
          month={selectedMonthYear.month}
          year={selectedMonthYear.year}
          excelFileName={[
            monthNames[selectedMonthYear.month - 1],
            selectedMonthYear.year,
          ]}
        />
      ) : (
        <>
          {selectedMonthYear && (
            <p className="text-slate-600 text-center">
              No bill has been generate for{" "}
              <span className="font-semibold">
                {monthNames[selectedMonthYear.month - 1]},{" "}
                {selectedMonthYear.year}
              </span>
            </p>
          )}
        </>
      )}
    </>
  );
};

export default MonthYearFilter;
