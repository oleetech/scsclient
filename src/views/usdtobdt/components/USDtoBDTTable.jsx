import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/BorderColor";
import GeneralModal from "../../../components/GeneralModal";
import EditUSDtoBDT from "./EditUSDtoBDT";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { monthNames } from "../../../components/DesignStandardize";
import { toast } from "react-toastify";

const USDtoBDTTable = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [data, setData] = useState([]);
  const [editingInfo, setEditingInfo] = useState(null);

  const [editUSDtoBDTModal, setEditUSDtoBDTModal] = useState(false);
  const toggleEditUSDtoBDTModal = () => {
    setEditUSDtoBDTModal((prevShowModal) => !prevShowModal);
  };
  const handleEditUSDtoBDTModal = (info) => {
    setEditingInfo(info);
    toggleEditUSDtoBDTModal();
  };

  const fetchUSDtoBDT = async () => {
    try {
      const response = await axios.get(`${apiUrl}/conversion-bdt/getAll`, {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      });

      const sortedData = response.data.sort((a, b) => {
        // Sort by year in descending order
        if (a.year !== b.year) {
          return b.year - a.year;
        } else {
          // If years are equal, sort by month in descending order
          return b.month - a.month;
        }
      });
      setData(sortedData);
      //   console.log(sortedData);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(
          "Token got expired for security issues. You are redirecting to login page."
        );
        window.location.href = "/";
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };
  useEffect(() => {
    fetchUSDtoBDT();
  }, []);

  return (
    <>
      <div className="md:max-h-96 overflow-auto">
        <table className="text-center md:w-full ">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="p-2">Serial No.</th>
              <th className="p-2">Month</th>
              <th className="p-2">Year</th>
              <th className="p-2">USD to BDT</th>
              <th className="p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((el, i) => {
              return (
                <tr key={i} className="border-b border-slate-300 h-16">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 uppercase">{monthNames[el.month - 1]}</td>
                  <td>{el.year}</td>
                  <td>{el.bdt_value} per USD</td>

                  <td className="text-[#0084FF] cursor-pointer p-2">
                    <button onClick={() => handleEditUSDtoBDTModal(el)}>
                      <EditIcon fontSize="inherit" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* modal to edit usd to bdt */}
      {editUSDtoBDTModal && editingInfo && (
        <GeneralModal title="Edit USD to BDT" onClose={toggleEditUSDtoBDTModal}>
          <EditUSDtoBDT info={editingInfo} />
        </GeneralModal>
      )}
    </>
  );
};

export default USDtoBDTTable;
