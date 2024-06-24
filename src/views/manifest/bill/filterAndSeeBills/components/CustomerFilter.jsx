import React, { useEffect, useState } from "react";
import GeneralSelect from "../../../../../components/GeneralSelect";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";
import ShowTable from "../helpers/ShowTable";
import { fetchBillsGeneric } from "../helpers/FetchBillsGeneric";

const CustomerFilter = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [loading, setLoading] = useState(false);
  const [selectedCusName, setSelectedCusName] = useState("");
  const [customerNameOptions, setCustomerNameOptions] = useState([]);
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
    getCustomerNames();
  }, []);

  const [manifests, setManifests] = useState([]);
  const fetchManifestsByCusName = async (selectedCustomer) => {
    setManifests([]);
    try {
      setLoading(true);

      const updatedManifests = await fetchBillsGeneric(
        `getAllCustomer/${selectedCustomer}`
      );
      setManifests(updatedManifests);
      setLoading(false);
    } catch (error) {
      toast.info(`No bill has been generate for ${selectedCusName}`);
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
        options={customerNameOptions}
        label="Select Customer Name"
        placeholder="..."
        onChange={(selectedOption) => {
          setSelectedCusName(selectedOption.value);
          fetchManifestsByCusName(selectedOption.value);
        }}
        value={
          customerNameOptions.find(
            (option) => option.value === selectedCusName
          ) || ""
        }
      />

      {loading && (
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid mx-auto" />
      )}

      {manifests.length > 0 ? (
        <ShowTable
          manifests={manifests}
          name={selectedCusName}
          excelFileName={selectedCusName}
        />
      ) : (
        <>
          {selectedCusName && (
            <p className="text-slate-600 text-center">
              No bill has been generate for{" "}
              <span className="font-semibold">{selectedCusName}</span>
            </p>
          )}
        </>
      )}
    </>
  );
};

export default CustomerFilter;
