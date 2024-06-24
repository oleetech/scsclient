import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assests/Logo.png";
import { userPanel } from "./DesignStandardize";
import SessionMenu from "../views/sessionMenu/SessionMenu";
import LogOut from "./LogOut";

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col justify-between px-2 py-5 bg-gray-900 shadow-xl border-b-2 w-48 h-screen fixed left-0 top-0 bottom-0">
      <div className="text-center flex flex-col gap-8 items-center">
        <Link to="/dashboard" className="flex gap-3 mr-auto">
          <img
            src={Logo}
            alt="SCS Express"
            className="my-auto w-12 border-gray-500 border-y-2 border-l-2 rounded-lg pl-[3px] py-[3px]"
          />
          <p className="text-white font-semibold text-xl my-auto">SCS</p>
        </Link>

        <SessionMenu />

        <ul className="flex flex-col text-left gap-3 w-max">
          {userPanel.map((el, i) => (
            <li
              key={i}
              className={`text-lg w-full p-1 text-gray-500 ${
                location.pathname === el.path
                  ? "border-orange-600 border-l-4 text-white"
                  : ` hover:border-l-2 hover:bg-gray-700 hover:text-white cursor-pointer`
              }`}
            >
              <Link to={el.path} className={`flex gap-1 items-center mb-1`}>
                <p className="text-orange-600">{el.Icons}</p>
                <p className="mt-1">{el.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <LogOut />
    </div>
  );
};

export default Navbar;
