import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/BorderColor";
import { hoverScale } from "../../components/DesignStandardize";
import GeneralModal from "../../components/GeneralModal";
import EditAdmin from "../admin/EditAdmin";
import MailIcon from "@mui/icons-material/MailOutline";
import NameIcon from "@mui/icons-material/BadgeOutlined";
import EyeIcon from "@mui/icons-material/Visibility";
import SeeProfile from "./components/SeeProfile";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../ApiUrlAndToken";
import axios from "axios";
import EditUser from "../users/components/EditUser";
import { toast } from "react-toastify";

const SessionMenu = () => {
  const [info, setInfo] = useState(null);

  const [viewModal, setViewModal] = useState(false);
  const toggleViewModal = () => {
    setViewModal((prevShowModal) => !prevShowModal);
  };

  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => {
    setEditModal((prevShowModal) => !prevShowModal);
  };

  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  useEffect(() => {
    const fetchLoggedInInfo = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/${isAdminLoggedIn ? "admin" : "user"}/${
            isAdminLoggedIn ? adminData.adminID : userData.userID
          }`,
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
        // console.log(response.data);
        setInfo(response.data);
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

    fetchLoggedInInfo();
  }, []);

  return (
    <>
      <div className="bg-[#424242] rounded-lg p-2 w-full relative shadow-md text-white">
        <div className="flex gap-2 justify-center text-white">
          {/* See profile button */}
          <div
            className={`hover:cursor-pointer rounded-full hover:text-orange-400 ${hoverScale}`}
            onClick={toggleViewModal}
          >
            <EyeIcon fontSize="small" />
          </div>

          {/* Edit profile button */}
          <div
            className={`hover:cursor-pointer rounded-full hover:text-orange-500 ${hoverScale}`}
            onClick={toggleEditModal}
          >
            <EditIcon fontSize="inherit" />
          </div>
        </div>

        {/* Profile Info */}
        {info && (
          <div className="overflow-hidden text-left font-medium">
            <p className="truncate flex gap-0 items-center">
              <NameIcon fontSize="inherit" className="text-orange-500 mt-1" />:{" "}
              {info.name}
            </p>
            <div className="truncate flex gap-0 items-center">
              <MailIcon fontSize="inherit" className="text-orange-500 mt-1" />
              <p>
                :{" "}
                <a
                  href="mailto:lamiahossain2017@gmail.com"
                  className=" hover:underline underline-offset-2"
                >
                  {info.email}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* modal to see details */}
      {viewModal && (
        <GeneralModal title="See Profile" onClose={toggleViewModal}>
          <SeeProfile info={info} />
        </GeneralModal>
      )}

      {/* modal to update details */}
      {editModal && (
        <GeneralModal title="Update Profile" onClose={toggleEditModal}>
          {isAdminLoggedIn ? (
            <EditAdmin info={info} />
          ) : (
            <EditUser info={info} />
          )}
        </GeneralModal>
      )}
    </>
  );
};

export default SessionMenu;
