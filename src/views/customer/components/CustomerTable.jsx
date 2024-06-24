import React, { useEffect, useState } from "react";
import GeneralModal from "../../../components/GeneralModal";
import axios from "axios";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import EditCustomer from "./EditCustomer";
import { toast } from "react-toastify";

const CustomerTable = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [customers, setCustomers] = useState([]);
  const [editingCustomerInfo, setEditingCustomerInfo] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => {
    setEditModal((prevShowModal) => !prevShowModal);
  };
  const handleEdit = (cusInfo) => {
    setEditingCustomerInfo(cusInfo);
    toggleEditModal();
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${apiUrl}/customer`, {
          headers: {
            Authorization: `Bearer ${
              isAdminLoggedIn
                ? adminData.tokens.accessToken
                : userData.tokens.accessToken
            }`,
          },
        });
        const sortedCustomers = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCustomers(sortedCustomers);
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
    fetchCustomer();
  }, []);
  return (
    <>
      <div className="max-h-80 overflow-auto">
        <table className="md:w-full ">
          <thead>
            <tr className="border-b border-slate-300 text-center">
              <th className="p-2">Serial No.</th>
              <th className="p-2 text-left">Customer Name</th>
              <th className="p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((el, i) => {
              return (
                <tr
                  key={i}
                  className="border-b border-slate-300 h-16 text-center"
                >
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 text-left">{el.name}</td>
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
      {editModal && editingCustomerInfo && (
        <GeneralModal title="Update Customer Profile" onClose={toggleEditModal}>
          <EditCustomer info={editingCustomerInfo} />
        </GeneralModal>
      )}
    </>
  );
};

export default CustomerTable;
