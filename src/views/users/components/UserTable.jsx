import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import "../../../components/Scrollbar.css";
import GeneralModal from "../../../components/GeneralModal";
import EditUser from "./EditUser";
import axios from "axios";
import { toast } from "react-toastify";

const UserTable = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [users, setUsers] = useState([]);
  const [editingUserInfo, setEditingUserInfo] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => {
    setEditModal((prevShowModal) => !prevShowModal);
  };
  const handleEdit = (userInfo) => {
    setEditingUserInfo(userInfo);
    toggleEditModal();
  };

  const handleDelete = async (info) => {
    if (
      window.confirm(`Are you sure you  want to delete the user ${info.name}?`)
    ) {
      try {
        await axios.delete(`${apiUrl}/user/${info.userid}`, {
          headers: {
            Authorization: `Bearer ${adminData.tokens.accessToken}`,
          },
        });

        window.location.reload();
        toast.warning("User has been deleted!!");
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
        const sortedUsers = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        // console.log("response.data:", response.data);
        setUsers(sortedUsers);
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
    fetchUser();
  }, []);

  return (
    <>
      <div className="max-h-80 overflow-auto">
        <table className="text-center md:w-full ">
          <thead>
            <tr className="border-b border-slate-300">
              <th className="p-2">Serial No.</th>
              <th className="p-2">User Name</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Designation</th>
              {isAdminLoggedIn && (
                <>
                  <th className="p-2">Edit</th>
                  <th className="p-2">Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((el, i) => {
              return (
                <tr key={i} className="border-b border-slate-300 h-16">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{el.name}</td>
                  <td>{el.email}</td>
                  <td className="p-2">{el.designation}</td>

                  {isAdminLoggedIn && (
                    <>
                      <td className="text-[#0084FF] cursor-pointer p-2">
                        <button onClick={() => handleEdit(el)}>
                          <EditIcon />
                        </button>
                      </td>
                      <td className="text-[#DB1E1E] cursor-pointer p-2">
                        <button onClick={() => handleDelete(el)}>
                          <DeleteIcon />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* modal to update details */}
      {editModal && editingUserInfo && (
        <GeneralModal title="Update User Profile" onClose={toggleEditModal}>
          <EditUser info={editingUserInfo} />
        </GeneralModal>
      )}
    </>
  );
};

export default UserTable;
