import React, { useEffect, useState } from "react";
import GeneralSelect from "../../../../../components/GeneralSelect";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";
import { monthNames } from "../../../../../components/DesignStandardize";
import ShowTable from "../helpers/ShowTable";
import { fetchBillsGeneric } from "../helpers/FetchBillsGeneric";

const CusMonthFilter = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }
  const [loading, setLoading] = useState(false);
  const [selectedCusName, setSelectedCusName] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  const [customerNameOptions, setCustomerNameOptions] = useState([]);
  const [monthYearOptions, setMonthYearOptions] = useState([]);

  useEffect(() => {
    const getCustomerNames = async () => {
      try {
        const response = await axios.get(`${apiUrl}/upload/customer-list`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
        const formattedOptions = response.data
          .map((item) => ({
            label: item.name,
            value: item.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCustomerNameOptions(formattedOptions);
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
    getCustomerNames();
  }, []);

  const [manifests, setManifests] = useState([]);

  useEffect(() => {
    const fetchManifestsByCusNameMonthYear = async (
      selectedCusName,
      selectedMonthYear
    ) => {
      // console.log(selectedCusName, selectedMonthYear);
      setManifests([]);

      try {
        setLoading(true);
        const updatedManifests = await fetchBillsGeneric(
          `getAll/${selectedCusName}/${selectedMonthYear.month}/${selectedMonthYear.year}`
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
    if (selectedCusName !== "" && selectedMonthYear !== "") {
      fetchManifestsByCusNameMonthYear(selectedCusName, selectedMonthYear);
    }
  }, [selectedCusName, selectedMonthYear]);
  return (
    <>
      <div className="flex flex-row flex-wrap gap-5 items-center">
        <GeneralSelect
          options={customerNameOptions}
          label="Select Customer Name"
          placeholder="..."
          onChange={(selectedOption) => {
            setSelectedCusName(selectedOption.value);
          }}
          value={
            customerNameOptions.find(
              (option) => option.value === selectedCusName
            ) || ""
          }
        />

        <GeneralSelect
          options={monthYearOptions}
          label="Select Month and Year"
          placeholder="..."
          onChange={(selectedOption) => {
            setSelectedMonthYear(selectedOption.value);
          }}
          value={
            monthYearOptions.find(
              (option) => option.value === selectedMonthYear
            ) || ""
          }
        />
      </div>

      {loading && (
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid mx-auto" />
      )}

      {manifests.length > 0 ? (
        <ShowTable
          manifests={manifests}
          name={selectedCusName}
          month={selectedMonthYear.month}
          year={selectedMonthYear.year}
          excelFileName={[
            selectedCusName,
            monthNames[selectedMonthYear.month - 1],
            selectedMonthYear.year,
          ]}
        />
      ) : (
        <>
          {selectedCusName && selectedMonthYear && (
            <p className="text-slate-600 text-center">
              No bill has been generate for {selectedCusName} in{" "}
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

export default CusMonthFilter;
