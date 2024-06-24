import React, { useState } from "react";
import GeneralInput from "../../../components/GeneralInput";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/RemoveCircle";
import { submitButton } from "../../../components/DesignStandardize";

const AddLocation = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [rows, setRows] = useState([
    {
      id: 1,
      location_from: "",
      location_to: "",
      weight_1: 1,
      weight_2: 49,
      weight_3: 50,
      rate_1: 0,
      rate_2: 0,
      rate_3: 0,
    },
  ]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      location_from: "",
      location_to: "",
      weight_1: rows[0].weight_1,
      weight_2: rows[0].weight_2,
      weight_3: rows[0].weight_3,
      rate_1: 0,
      rate_2: 0,
      rate_3: 0,
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const handleInputChange = (id, updatedField, value) => {
    const rowIndex = rows.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedRows = [...rows];
      updatedRows[rowIndex][updatedField] = value;
      setRows(updatedRows);
    }
  };

  const handleSubmit = async () => {
    try {
      const isValid = rows.every(
        (row) =>
          row.location_from.trim() !== "" &&
          row.location_to.trim() !== "" &&
          row.rate_1 > 0 &&
          row.rate_2 > 0 &&
          row.rate_3 > 0
      );

      if (!isValid) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const promises = rows.map((row) => {
        const data = {
          location_from: row.location_from.toUpperCase(),
          location_to: row.location_to,
          weight_1: row.weight_1,
          rate_1: parseFloat(row.rate_1),
          weight_2: row.weight_2,
          rate_2: parseFloat(row.rate_2),
          weight_3: row.weight_3,
          rate_3: parseFloat(row.rate_3),
        };
        // console.log("data:", data);
        return axios.post(`${apiUrl}/location-rate`, data, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
      });

      await Promise.all(promises);

      toast.success("New location and cost has been added!");
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

  return (
    <>
      <div className="overflow-auto max-w-[320px] md:max-w-[520px] lg:max-w-[800px] max-h-96">
        <table>
          <thead>
            <tr className="text-base text-black text-center">
              <th />
              <th className="p-1">From</th>
              <th className="p-1">To</th>
              <th className="p-1">1st KG (USD)</th>
              <th className="p-1">Over 1st KG (USD)</th>
              <th className="p-1">Over 50 KG (USD)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <div className="flex flex-col gap-3">
                  <div
                    className={`tooltip tooltip-right tooltip-success sticky left-0 z-40 bg-white ${
                      rows.length === 1 && "mt-2 h-10"
                    }`}
                    data-tip="Add row"
                  >
                    <AddIcon
                      onClick={addRow}
                      className="mt-2 hover:text-green-500"
                    />
                  </div>
                  {rows.length > 1 && (
                    <div
                      className="tooltip tooltip-right tooltip-error sticky left-0 z-40 bg-white"
                      data-tip="Remove row"
                    >
                      <RemoveIcon
                        onClick={() => deleteRow(row.id)}
                        className="mt-2 hover:text-red-500"
                      />
                    </div>
                  )}
                </div>
                <td className="p-0">
                  <GeneralInput
                    type="text"
                    placeholder="From"
                    value={row.location_from}
                    onChange={(ev) =>
                      handleInputChange(
                        row.id,
                        "location_from",
                        ev.target.value
                      )
                    }
                    table={1}
                  />
                </td>
                <td className="p-0">
                  <GeneralInput
                    type="text"
                    placeholder="To"
                    value={row.location_to}
                    onChange={(ev) =>
                      handleInputChange(row.id, "location_to", ev.target.value)
                    }
                    table={1}
                  />
                </td>
                <td className="p-0">
                  <GeneralInput
                    type="number"
                    placeholder="1st KG"
                    value={row.rate_1}
                    onChange={(ev) =>
                      handleInputChange(row.id, "rate_1", ev.target.value)
                    }
                    min={1}
                    table={1}
                  />
                </td>
                <td className="p-0">
                  <GeneralInput
                    type="number"
                    placeholder="Over 1st KG"
                    value={row.rate_2}
                    onChange={(ev) =>
                      handleInputChange(row.id, "rate_2", ev.target.value)
                    }
                    min={1}
                    table={1}
                  />
                </td>
                <td className="p-0">
                  <GeneralInput
                    type="number"
                    placeholder="Over 50 KG"
                    value={row.rate_3}
                    onChange={(ev) =>
                      handleInputChange(row.id, "rate_3", ev.target.value)
                    }
                    min={1}
                    table={1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className={`${submitButton} mt-3 mx-auto`} onClick={handleSubmit}>
        Add Location
      </button>
    </>
  );
};

export default AddLocation;
