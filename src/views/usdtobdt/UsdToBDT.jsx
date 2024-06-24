import React, { useState } from "react";
import GeneralModal from "../../components/GeneralModal";
import RightArrowIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { blackLinkButton } from "../../components/DesignStandardize";
import AddUSDtoBDT from "./components/AddUSDtoBDT";
import USDtoBDTTable from "./components/USDtoBDTTable";

const UsdToBDT = () => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal((prevShowModal) => !prevShowModal);
  };

  return (
    <>
      <button className={`${blackLinkButton} ml-auto`} onClick={toggleModal}>
        Add New USD to BDT <RightArrowIcon />
      </button>

      <USDtoBDTTable />

      {/* modal to add usd to bdt */}
      {modal && (
        <GeneralModal title="Add USD to BDT" onClose={toggleModal}>
          <AddUSDtoBDT />
        </GeneralModal>
      )}
    </>
  );
};

export default UsdToBDT;
