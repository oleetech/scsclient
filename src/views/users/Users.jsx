import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { isAdminLoggedIn } from "../../ApiUrlAndToken";
import { blackLinkButton } from "../../components/DesignStandardize";
import RightArrowIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import GeneralModal from "../../components/GeneralModal";
import AddUsers from "./components/AddUsers";
import UserTable from "./components/UserTable";
import { countUser } from "./components/CountUsers";

const Users = () => {
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddUserModal = () => {
    setAddUserModal((prevShowModal) => !prevShowModal);
  };

  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const fetchUserCount = async () => {
      const count = await countUser();
      setUserCount(count);
    };

    fetchUserCount();
  }, []);
  return (
    <>
      <PageHeader
        title="Total Users"
        subtitle="You are viewing the total number of users that have access to this software."
        adminText="You can add or remove users any time."
      />

      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div>
          <p className="text-[#0084FF] text-lg border-b-2 border-[#0084FF] px-2 w-max">
            Total Users - {userCount}
          </p>
        </div>
        {isAdminLoggedIn && (
          <button className={`${blackLinkButton}`} onClick={toggleAddUserModal}>
            Add Users <RightArrowIcon />
          </button>
        )}
      </div>

      <UserTable />

      {/* modal to add users */}
      {addUserModal && (
        <GeneralModal title="Add New User" onClose={toggleAddUserModal}>
          <AddUsers />
        </GeneralModal>
      )}
    </>
  );
};

export default Users;
