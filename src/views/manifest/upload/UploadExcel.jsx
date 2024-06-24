import React, { useRef, useState } from "react";
import * as xlsx from "xlsx";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadIcon from "@mui/icons-material/DriveFolderUpload";
import GeneralInput from "../../../components/GeneralInput";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import { keyLabelMapping } from "../../../components/DesignStandardize";
import { toast } from "react-toastify";

const UploadExcel = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [fullExcelData, setFullExcelData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [fileData, setFileData] = useState([]);

  const [mawb, setMawb] = useState("");
  const [flight, setFlight] = useState("");
  const [date, setDate] = useState("");

  const inputRef = useRef(null);

  const readexcel = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      // No file selected, do nothing
      return;
    }

    setFileName(selectedFile?.name);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = event.target.result;
        const chunkSize = 1024 * 1024; // 1MB chunk size
        let offset = 0;
        let chunk;
        let parsedData = []; // Temporary array to hold parsed data

        while (offset < data.byteLength) {
          chunk = data.slice(offset, offset + chunkSize);
          const workbook = xlsx.read(chunk, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const excelJson = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
          }); // Include defval: "" to treat empty cells as ""
          parsedData.push(...excelJson);
          offset += chunkSize;
        }

        // Filter out rows with all cells being empty after the 6th row
        const filteredData = parsedData.filter(
          (row, index) => index <= 5 || row.some((cell) => cell !== "")
        );

        // Get the keys from the 5th row
        const keys = filteredData[5];

        // Create an array of objects with keys corresponding to the 5th row
        const transformedData = filteredData.slice(6).map((row) =>
          row.reduce((acc, cell, index) => {
            // Trim spaces and remove slashes from keys
            const key = keys[index].replace(/\s/g, "").replace(/\//g, "");
            if (key === "COD" || key === "VAL") {
              // Extract numerical value from string like "USD27.00"
              const numericalValue =
                typeof cell === "string"
                  ? cell.trim()
                    ? parseFloat(cell.match(/[\d.]+/)[0])
                    : ""
                  : "";
              acc[key] = numericalValue;
            } else {
              acc[key] = cell;
            }
            return acc;
          }, {})
        );

        // Set fileData from the 7th row to the end of transformedData to be sent to db
        setFileData(transformedData);

        // Set fullExcelData to filteredData - to show in UI
        setFullExcelData(filteredData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const uploadManifest = async (e) => {
    e.preventDefault();

    try {
      const [year, month] = date.split("-");
      const chunks = [];
      const maxChunkSize = 100;

      // Split fileData into chunks
      for (let i = 0; i < fileData.length; i += maxChunkSize) {
        const chunk = fileData.slice(i, i + maxChunkSize);
        chunks.push(chunk);
      }

      // Iterate through chunks and send separate requests
      for (const chunk of chunks) {
        const postData = {
          mawb: mawb,
          flight: flight,
          date: date,
          month: parseInt(month),
          year: parseInt(year),
          fileData: chunk,
        };

        // Send the request for each chunk
        const response = await axios.post(
          `${apiUrl}/upload/register/mawb/company`,
          postData,
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
        // console.log("Sending chunk data:", postData);
        // console.log("API response:", response.data);
        setApiData(response.data);
        setUploaded(1);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(
          "Token got expired for security issues. You are redirecting to login page."
        );
        window.location.href = "/";
      } else {
        console.error("Error posting data to API:", error);
      }
    }
  };

  // Render table headers
  const renderTableHeaders = () => {
    if (apiData.length === 0) return null;

    const keysToDisplay = Object.keys(keyLabelMapping);

    return (
      <>
        {keysToDisplay.map((key, index) => (
          <th key={index} className="border p-1">
            {keyLabelMapping[key]}
          </th>
        ))}
      </>
    );
  };

  // Render table rows
  const renderRows = () => {
    return apiData.map((item, index) => (
      <tr key={index}>
        {Object.keys(keyLabelMapping).map((key, index) => (
          <td key={index} className="border p-2">
            {item[key]}
          </td>
        ))}
      </tr>
    ));
  };

  const resetAll = () => {
    setFileData([]);
    setFileName("");
    setUploaded(0);
    setApiData([]);
    setFullExcelData([]);
  };

  return (
    <>
      <form
        className="flex flex-col gap-3 font-[Poppins]"
        onSubmit={uploadManifest}
      >
        <div className="flex flex-row flex-wrap gap-3">
          <GeneralInput
            label="MAWB"
            labelSpanText="*"
            type="text"
            placeholder="Enter MAWB"
            value={mawb}
            onChange={(e) => {
              setMawb(e.target.value);
            }}
            required
          />

          <GeneralInput
            label="Flight"
            labelSpanText="*"
            type="text"
            placeholder="Enter Flight"
            value={flight}
            onChange={(e) => {
              setFlight(e.target.value);
            }}
            required
          />

          <GeneralInput
            label="Date of Manifest"
            labelSpanText="*"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            required
          />

          {/* Select Manifest file */}
          <div className="flex join">
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => {
                resetAll();
                readexcel(e);
              }}
            />

            <div className="flex flex-col gap-2">
              <label className="flex flex-row gap-2">
                Select Manifests File
                <span className="font-semibold text-red-600">*</span>
              </label>
              <div className="flex items-center w-max min-w-24 rounded-md hover:cursor-pointer join-item">
                <p
                  className="border-y-2 border-l-2 rounded-l-md p-1 w-max bg-black text-white"
                  onClick={() => {
                    resetAll();
                    inputRef.current?.click();
                  }}
                >
                  <AttachFileIcon fontSize="inherit" />{" "}
                  <span>Select File </span>
                </p>

                <p
                  className="p-1 border-y-2 border-r-2 rounded-r-md w-32 truncate bg-gray-100"
                  onClick={() => {
                    resetAll();

                    inputRef.current?.click();
                  }}
                >
                  {fileName || ".xlsx"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`bg-success hover:bg-green-700 px-1 text-white w-max text-lg my-auto
          ${
            mawb === "" ||
            flight === "" ||
            date === "" ||
            fileName === "" ||
            fileData.length === 0
              ? "btn btn-sm btn-disabled"
              : "btn btn-sm"
          }
          `}
        >
          <UploadIcon /> Upload
        </button>
      </form>

      {mawb !== "" &&
        flight !== "" &&
        date !== "" &&
        fileName !== "" &&
        fileData.length === 0 && (
          <p className="text-red-600 text-center animate-pulse">
            Seletced manifest has no data in it...
          </p>
        )}

      {fileData.length > 0 && (
        <>
          {fullExcelData && fileData && (
            <>
              {uploaded === 0 && (
                <p
                  className="btn btn-ghost cursor-pointer w-full mx-auto"
                  onClick={() => {
                    resetAll();
                  }}
                >
                  Choose Another File
                </p>
              )}

              <div className="max-h-[600px] overflow-auto border-t border-slate-300">
                <table className="text-center md:w-full">
                  <thead>
                    <tr className="border-b border-slate-300">
                      {uploaded === 0 ? (
                        <>
                          {fullExcelData[5]?.map((row, index) => (
                            <th key={index} className="border p-1">
                              {row === "" ? "-" : row}
                            </th>
                          ))}
                        </>
                      ) : (
                        <>{renderTableHeaders()}</>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {uploaded === 0 ? (
                      <>
                        {fullExcelData
                          .slice(6) // Start from the 7th row
                          .filter((row) => row.some((cell) => cell !== "")) // Filter out rows with at least one non-empty cell
                          .map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border p-2">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </>
                    ) : (
                      <>{renderRows()}</>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default UploadExcel;
