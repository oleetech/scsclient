import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import BillIcon from "@mui/icons-material/ReceiptLong";
import DeleteIcon from "@mui/icons-material/DeleteSweepOutlined";
// import EyeIcon from "@mui/icons-material/Visibility";
import {
  hoverScale,
  ManageExcelManifestHeadres,
} from "../../../../components/DesignStandardize";
import GeneralModal from "../../../../components/GeneralModal";
import EditRow from "./EditRow";
import { Link } from "react-router-dom";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";
import GeneralSelect from "../../../../components/GeneralSelect";
import GeneralInput from "../../../../components/GeneralInput";

const ManageExcel = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMAWBName, setSelectedMAWBName] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingRow, setEditingRow] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => {
    setEditModal((prevShowModal) => !prevShowModal);
  };
  const handleEdit = (rowId) => {
    setEditingRow(rowId);
    toggleEditModal();
  };

  const [mawbs, setMawbs] = useState([]);
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

        setMawbs(formattedOptions);
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
    setSelectedDate("");
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/upload/getByMAWB/${selectedMAWB}`,
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
      const sortedData = response.data.sort((a, b) => a.uploadid - b.uploadid);
      setManifests(sortedData);
      setLoading(false);
      if (response.data.status === 404) {
        toast.error(`${response.data.message}`);
      }
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

  const fetchManifestsByDate = async (selectedDate) => {
    setManifests([]);
    setSelectedMAWBName("");
    try {
      setLoading(true);

      const response = await axios.get(
        `${apiUrl}/upload/getAll/${selectedDate}`,
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
      const sortedData = response.data.sort((a, b) => a.uploadid - b.uploadid);
      setManifests(sortedData);
      // console.log(response.data);
      setLoading(false);

      if (response.data.status === 404) {
        toast.error(`${response.data.message}`);
      }
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

  const handleDelete = async (info) => {
    if (
      window.confirm(
        `Are you sure you  want to delete the record for ${info.name}?`
      )
    ) {
      try {
        await axios.delete(`${apiUrl}/upload/${info.uploadid}`);
        toast.warning("Record has been deleted!!");
        fetchManifestsByMAWB(selectedMAWBName);
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
    }
  };

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 font-semibold">
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

        <p className="my-auto lg:m-auto bg-slate-50 shadow p-1 rounded">Or</p>

        <GeneralSelect
          options={mawbs}
          label="Select MAWB"
          placeholder="..."
          onChange={(selectedOption) => {
            setSelectedMAWBName(selectedOption.value);
            fetchManifestsByMAWB(selectedOption.value);
          }}
          value={
            mawbs.find((option) => option.value === selectedMAWBName) || ""
          }
        />
      </div>
      {loading && (
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid mx-auto" />
      )}

      {manifests.length > 0 && (
        <>
          <div className="max-h-[600px] overflow-auto border-t border-slate-300 mt-3">
            <table className="text-center md:w-full">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="border p-1">Edit</th>
                  <th className="border p-1">Delete</th>
                  <th className="border p-1">Bill Generate</th>
                  {/* <th className="border p-1">See Bill</th> */}

                  {ManageExcelManifestHeadres.map((header, index) => (
                    <th key={index} className="border p-1">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {manifests.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      !item.billgenerate ? "bg-inherit" : "bg-green-100"
                    }`}
                  >
                    <td className={`text-info p-2 border`}>
                      {!item.billgenerate ? (
                        <button
                          className={`cursor-pointer ${hoverScale} hover:text-blue-600`}
                          onClick={() => handleEdit(item)}
                        >
                          <EditIcon />
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className={`text-error p-2 border`}>
                      {!item.billgenerate ? (
                        <button
                          className={`cursor-pointer ${hoverScale} hover:text-red-600`}
                          onClick={() => handleDelete(item)}
                        >
                          <DeleteIcon />
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className={`text-success p-2 border`}>
                      {!item.billgenerate ? (
                        <Link
                          className={`${hoverScale} hover:text-green-800`}
                          target="_blank"
                          to={`/manage-manifest/bill-generate/${item.name}/${item.uploadid}`}
                        >
                          <BillIcon />
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    {/* <td
                      className={`text-primary cursor-pointer p-2 border ${hoverScale} hover:text-blue-800`}
                    >
                      <button onClick={() => handleEdit(item)}>
                        <EyeIcon />
                      </button>
                    </td> */}
                    <td className="border p-1">{item.uploadid}</td>
                    <td className="border p-1">{item.awb}</td>
                    <td className="border p-1">{item.name}</td>
                    <td className="border p-1">{item.address}</td>
                    <td className="border p-1">{item.consigne}</td>
                    <td className="border p-1">{item.bin_vat}</td>
                    <td className="border p-1">{item.dest}</td>
                    <td className="border p-1">{item.cnee_address}</td>
                    <td className="border p-1">{item.ctc}</td>
                    <td className="border p-1">{item.tel_no}</td>
                    <td className="border p-1">{item.nop}</td>
                    <td className="border p-1">{item.weight}</td>
                    <td className="border p-1">{item.volume}</td>
                    <td className="border p-1">{item.dsct}</td>
                    <td className="border p-1">{item.cod}</td>
                    <td className="border p-1">{item.val}</td>
                    <td className="border p-1">{item.re}</td>
                    <td className="border p-1">{item.bag_no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* modal to update details */}
      {editModal && editingRow && (
        <GeneralModal title="Update Row" onClose={toggleEditModal}>
          <EditRow row={editingRow} />
        </GeneralModal>
      )}
    </>
  );
};

export default ManageExcel;
