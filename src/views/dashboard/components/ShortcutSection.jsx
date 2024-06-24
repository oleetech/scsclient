import React, { useEffect, useState } from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link } from "react-router-dom";
import GeneralModal from "../../../components/GeneralModal";
import SeeProfile from "../../sessionMenu/components/SeeProfile";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";

const ShortcutSection = () => {
  const [info, setInfo] = useState(null);
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
  }, [adminData, userData]);

  const [viewModal, setViewModal] = useState(false);
  const toggleViewModal = () => {
    setViewModal((prevShowModal) => !prevShowModal);
  };

  const shortcuts = [
    { text: "Add User", to: "/users" },
    { text: "Add Location-Cost", to: "/location-cost" },
    { text: "See Profile", to: "/" },
  ];

  return (
    <>
      <div className="flex flex-col gap-10">
        <p className="text-xl font-bold">Your Shortcuts</p>
        <div className="flex flex-row flex-wrap md:w-3/5 gap-3 md:gap-5">
          {shortcuts.map((el, i) => {
            return (
              <div key={i}>
                {i === 2 ? (
                  <div className={`btn btn-md w-max`} onClick={toggleViewModal}>
                    {el.text}
                    <ArrowOutwardIcon style={{ fontSize: "1rem" }} />
                  </div>
                ) : (
                  <Link to={el.to} className="btn btn-md w-max">
                    {el.text}
                    <ArrowOutwardIcon style={{ fontSize: "1rem" }} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* modal to see details */}
      {viewModal && info && (
        <GeneralModal title="See Profile" onClose={toggleViewModal}>
          <SeeProfile info={info} />
        </GeneralModal>
      )}
    </>
  );
};

export default ShortcutSection;
