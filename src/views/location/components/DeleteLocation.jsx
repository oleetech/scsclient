import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteLocation = ({ info, getLocation }) => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you  sure you want to delete the information for ${info.from} to ${info.to}?`
      )
    ) {
      try {
        await axios.delete(`${apiUrl}/location/${info.licID}`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });

        // window.location.reload();
        getLocation();

        toast.warning("Location has been deleted!!");
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
    <button onClick={handleDelete}>
      <DeleteIcon />
    </button>
  );
};

export default DeleteLocation;
