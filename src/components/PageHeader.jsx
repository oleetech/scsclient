import React from "react";
import { isAdminLoggedIn } from "../ApiUrlAndToken";

const PageHeader = ({ title, subtitle, adminText }) => {
  return (
    <div className="flex flex-col gap-3 pb-8 border-b border-gray-200">
      <span className="text-3xl font-extrabold text-black">{title}</span>

      {subtitle && !adminText && <p className="text-[#9FA1A6]">{subtitle}</p>}
      {subtitle && adminText && isAdminLoggedIn && (
        <p className="text-[#9FA1A6]">
          {subtitle} {adminText}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
