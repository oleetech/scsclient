import React, { useState, useEffect, useRef } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { handleLogout } from "./LogOut";
import LogoutIcon from "@mui/icons-material/Logout";
import { hoverScale, userPanel } from "./DesignStandardize";
import { Link } from "react-router-dom";

const FloatingButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef(null);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const buttonStyle =
    "bg-orange-800 text-white p-2 cursor-pointer flex flex-row gap-1 rounded-lg";
  return (
    <div className="fixed bottom-2 right-2 flex flex-col items-end md:hidden z-50">
      {/* Circle button */}
      <div
        ref={buttonRef}
        className={`rounded-full bg-orange-700 text-white p-2 text-xs cursor-pointer relative ${
          isExpanded === true && "animate-spin"
        } `}
        onClick={toggleExpansion}
      >
        <MenuIcon />
      </div>

      {/* Expanded buttons */}
      <div
        className={`${
          isExpanded ? "flex flex-col gap-2 absolute w-max" : "hidden"
        } rounded-md`}
        style={{
          transform: `translateY(${isExpanded ? "-105%" : "0"})`,
        }}
      >
        {userPanel.map((el, i) => {
          return (
            <Link
              key={i}
              className={`${buttonStyle} ${hoverScale}`}
              to={`${el.path}`}
            >
              <span className="my-auto">{el.Icons}</span> {el.name}
            </Link>
          );
        })}

        <div className={`${buttonStyle}`} onClick={() => handleLogout()}>
          <LogoutIcon fontSize="inherit" className="my-auto" /> Log out
        </div>
      </div>
    </div>
  );
};

export default FloatingButton;
