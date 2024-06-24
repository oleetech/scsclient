import React, { useEffect, useState } from "react";
import GeneralModal from "../../components/GeneralModal";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../ApiUrlAndToken";
import axios from "axios";
import EditSpxParcelRate from "./EditSpxParcelRate";
import { blackLinkButton } from "../../components/DesignStandardize";
import RightArrowIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import AddSpxRate from "./AddSpxRate";
import { toast } from "react-toastify";

const SpxParcelRateTable = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [location, setLocation] = useState([]);

  const [locationInfo, setLocationInfo] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => {
    setEditModal((prevShowModal) => !prevShowModal);
  };
  const handleEdit = (info) => {
    setLocationInfo(info);
    toggleEditModal();
  };

  const [addModal, setAddModal] = useState(false);
  const toggleModal = () => {
    setAddModal((prevShowModal) => !prevShowModal);
  };

  const fetchLocation = async () => {
    try {
      const response = await axios.get(`${apiUrl}/parcelrate/getAll`, {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      });
      const sortedLocations = response.data.sort((a, b) =>
        a.location.localeCompare(b.location)
      );
      setLocation(sortedLocations);
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
    fetchLocation();
  }, [addModal, editModal]);

  return (
    <>
      <button className={`${blackLinkButton} ml-auto`} onClick={toggleModal}>
        Add SPX Parcel Rate <RightArrowIcon />
      </button>

      <div className="max-h-80 overflow-auto">
        <table className="text-center md:w-full ">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="p-2">Location</th>
              <th className="p-2">1st KG</th>
              <th className="p-2">Over 1st KG</th>
              <th className="p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {location.map((el, i) => {
              return (
                <tr key={i} className="border-b border-slate-300 h-16">
                  <td className="p-2 uppercase">{el.location}</td>
                  <td>BDT {el.rate1}</td>
                  <td>BDT {el.rate2}/PER KG</td>

                  <td className="text-[#0084FF] cursor-pointer p-2">
                    <button onClick={() => handleEdit(el)}>
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* modal to update details */}
      {editModal && locationInfo && (
        <GeneralModal title="Edit SPX Parcel Rate" onClose={toggleEditModal}>
          <EditSpxParcelRate info={locationInfo} />
        </GeneralModal>
      )}

      {/* modal to add users */}
      {addModal && (
        <GeneralModal title="Add SPX Parcel Rate" onClose={toggleModal}>
          <AddSpxRate onCancel={() => setAddModal(false)} />
        </GeneralModal>
      )}
    </>
  );
};
export default SpxParcelRateTable;
