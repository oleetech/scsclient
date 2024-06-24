import React, { useEffect, useState } from "react";
import { isAdminLoggedIn } from "../../ApiUrlAndToken";
import Logo from "../../assests/Logo.png";
import EditIcon from "@mui/icons-material/EditNoteOutlined";
import GeneralModal from "../../components/GeneralModal";
import EditAdmin from "./EditAdmin";
import { getAdmins } from "./AdminList";
import DeleteAdmin from "./DeleteAdmin";

const HandleAdmin = () => {
  const [admins, setAdmins] = useState([]);

  const [editModal, setEditModal] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const toggleEditModal = () => {
    setEditModal((prevShowModal) => !prevShowModal);
  };
  const handleEdit = (info) => {
    setEditingInfo(info);
    toggleEditModal();
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const admins = await getAdmins();
      setAdmins(admins);
    };

    fetchAdmin();
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex flex-col gap-3 items-center justify-center bg-white">
        <img src={Logo} alt="SCS Express" className="h-[100px] mb-5" />

        <p className="text-2xl text-red-600 font-medium">Remove Admin</p>

        <div className="max-h-80 w-max mx-auto overflow-auto">
          <table className="text-center md:w-full ">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="p-2">Serial No.</th>
                <th className="p-2">Admin Name</th>
                <th className="p-2">E-mail</th>
                {isAdminLoggedIn && (
                  <>
                    <th className="p-2">Edit</th>
                    <th className="p-2">Delete</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {admins.map((el, i) => {
                return (
                  <tr key={i} className="border-b border-slate-300 h-16">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{el.name}</td>
                    <td>{el.email}</td>

                    {isAdminLoggedIn && (
                      <>
                        <td className="text-[#0084FF] cursor-pointer p-2">
                          <button onClick={() => handleEdit(el)}>
                            <EditIcon />
                          </button>
                        </td>
                        <td className="text-[#DB1E1E] cursor-pointer p-2">
                          <DeleteAdmin info={el} />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal to update details */}
      {editModal && editingInfo && (
        <GeneralModal title="Update Profile" onClose={toggleEditModal}>
          <EditAdmin info={editingInfo} />
        </GeneralModal>
      )}
    </>
  );
};

export default HandleAdmin;
