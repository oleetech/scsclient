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

const MawbFilter = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [loading, setLoading] = useState(false);
  const [selectedMAWBName, setSelectedMAWBName] = useState("");
  const [mawbNames, setMawbNames] = useState([]);
  useEffect(() => {
    const getMawbNames = async () => {
      try {
        const response = await axios.get(`${apiUrl}/upload/mawb-list`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
        const formattedOptions = response.data.map((item) => ({
          label: item,
          value: item,
        }));
        setMawbNames(formattedOptions);
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
    getMawbNames();
  }, []);

  const [manifests, setManifests] = useState([]);

  const fetchManifestsByMAWB = async (selectedMAWB) => {
    setManifests([]);
    try {
      setLoading(true);

      const updatedManifests = await fetchBillsGeneric(
        `getByMAWB/${selectedMAWB}`
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
        options={mawbNames}
        label="Select MAWB"
        placeholder="..."
        onChange={(selectedOption) => {
          setSelectedMAWBName(selectedOption.value);
          fetchManifestsByMAWB(selectedOption.value);
        }}
        value={
          mawbNames.find((option) => option.value === selectedMAWBName) || ""
        }
      />

      {loading && (
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid mx-auto" />
      )}

      {manifests.length > 0 ? (
        <ShowTable
          manifests={manifests}
          name={selectedMAWBName}
          excelFileName={selectedMAWBName}
        />
      ) : (
        <>
          {selectedMAWBName && (
            <p className="text-slate-600 text-center">
              No bill has been generate for{" "}
              <span className="font-semibold">{selectedMAWBName}</span>
            </p>
          )}
        </>
      )}
    </>
  );
};

export default MawbFilter;
