import React from "react";
import { useLocation } from "react-router-dom";

const TopNavbar = () => {
  const location = useLocation();
  return (
    <div className="md:ml-[195px] h-12 bg-white text-black flex items-center px-3 shadow">
      <div className="text-sm breadcrumbs font-medium">
        <ul>
          <li>
            <a
              href="/dashboard"
              className="text-white bg-black font-semibold py-1 px-3 text-lg m-1 no-underline"
            >
              S
            </a>
          </li>

          {location.pathname.includes("/manage-manifest/bill-generate") ? (
            <>
              <li>
                <a href="/manage-manifest">Manage Manifest</a>
              </li>
              <li>
                <p>Bill Generate</p>
              </li>
            </>
          ) : (
            <li>
              <p>
                {location.pathname === "/dashboard"
                  ? "Dashboard"
                  : location.pathname === "/upload-manifest"
                  ? "Upload Manifest"
                  : location.pathname === "/manage-manifest"
                  ? "Manage Manifest & Generate Bill"
                  : location.pathname === "/see-bills"
                  ? "Filter and Download"
                  : location.pathname === "/location-cost"
                  ? "Location-Cost"
                  : location.pathname === "/users"
                  ? "Users"
                  : location.pathname === "/customers"
                  ? "Customers"
                  : ""}
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TopNavbar;
