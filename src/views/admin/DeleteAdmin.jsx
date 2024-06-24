import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";
import { apiUrl } from "../../ApiUrlAndToken";

const DeleteAdmin = (info) => {
  let adminData = JSON.parse(window.localStorage.getItem("admin"));

  const handleDelete = async (info) => {
    if (
      window.confirm(`Are you sure you want to delete the admin ${info.name}?`)
    ) {
      try {
        await axios.delete(`${apiUrl}/admin/deleteAdmin/${info.adminid}`, {
          headers: {
            Authorization: `Bearer ${adminData.tokens.accessToken}`,
          },
        });

        window.location.reload();
        toast.warning("Admin has been deleted!!");
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
    <button onClick={() => handleDelete(info)}>
      <DeleteIcon />
    </button>
  );
};

export default DeleteAdmin;
