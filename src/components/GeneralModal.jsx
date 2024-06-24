import React from "react";
import { hoverScale } from "./DesignStandardize";
import CloseIcon from "@mui/icons-material/CloseOutlined";

const GeneralModal = ({ children, onClose, title }) => {
  return (
    <div className="z-10 fixed inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-50 fixed inset-0" onClick={onClose} />
      <div className="card bg-white z-20 p-4 modal-white flex flex-col gap-4">
        <div className="card-title flex justify-between">
          <p className="text-xl text-blue-900 font-bold">{title}</p>
          <CloseIcon
            onClick={onClose}
            fontSize="1px"
            className={`hover:cursor-pointer hover:bg-blue-900 w-5 h-5 hover:text-white rounded-full p-[1px] ${hoverScale}`}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default GeneralModal;
