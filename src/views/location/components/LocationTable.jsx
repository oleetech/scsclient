import React, { useEffect, useState } from "react";
import GeneralModal from "../../../components/GeneralModal";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import EditEachLocation from "./EditEachLocation";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { blackLinkButton } from "../../../components/DesignStandardize";
import RightArrowIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import AddLocation from "./AddLocation";
import { toast } from "react-toastify";

const LocationTable = () => {
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
      const response = await axios.get(`${apiUrl}/location-rate/getAll`, {
        headers: {
          Authorization: `Bearer ${
            isAdminLoggedIn
              ? adminData.tokens.accessToken
              : userData.tokens.accessToken
          }`,
        },
      });

      // console.log("response.data:", response.data);
      const sortedLocations = response.data.sort((a, b) => {
        if (a.location_from < b.location_from) return -1;
        if (a.location_from > b.location_from) return 1;
        return 0;
      });

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
        Add Location and Cost <RightArrowIcon />
      </button>

      <div className="md:max-h-96 overflow-auto">
        <table className="text-center md:w-full ">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="p-2">Serial No.</th>
              <th className="p-2">Location</th>
              <th className="p-2">1st KG ($/PERKG)</th>
              <th className="p-2">Over 1st KG ($/PERKG)</th>
              <th className="p-2">Over 50 KG ($/PERKG)</th>

              <th className="p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {location.map((el, i) => {
              return (
                <tr key={i} className="border-b border-slate-300 h-16">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 uppercase">
                    {el.location_from} TO {el.location_to}
                  </td>
                  <td>{el.rate_1}</td>
                  <td>{el.rate_2}</td>
                  <td>{el.rate_3}</td>

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
        <GeneralModal
          title="Edit Location-Cost Details"
          onClose={toggleEditModal}
        >
          <EditEachLocation info={locationInfo} />
        </GeneralModal>
      )}

      {/* modal to add users */}
      {addModal && (
        <GeneralModal title="Add Location and Cost" onClose={toggleModal}>
          <AddLocation onCancel={toggleModal} onClose={toggleModal} />
        </GeneralModal>
      )}
    </>
  );
};

export default LocationTable;
