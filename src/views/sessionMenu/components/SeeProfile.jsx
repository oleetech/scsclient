import React from "react";
import profileDefault from "../../../assests/profile.png";
import MailIcon from "@mui/icons-material/MailOutline";
import DesignationIcon from "@mui/icons-material/BadgeOutlined";
import { isAdminLoggedIn } from "../../../ApiUrlAndToken";

const SeeProfile = ({ info }) => {
  const profile = [
    {
      icon: <MailIcon fontSize="inherit" />,
      info: info.email,
    },
    {
      icon: <DesignationIcon fontSize="inherit" />,
      info: info.designation || "",
    },
  ];
  // console.log(profile);
  return (
    <div>
      {/* Profile Picture */}
      <img
        className={`w-20 h-20 shadow rounded-full mx-auto`}
        src={profileDefault}
        // src={photo ? `${apiUrl}/uploads/${photo}` : profileDefault}
        alt="Profile"
      />

      {/* Profile Info */}
      <div className="overflow-hidden font-medium">
        <p className="text-center">{info.name}</p>
        {profile.map((el, i) => {
          return (
            <p
              key={i}
              className={`truncate flex gap-0 items-center ${
                isAdminLoggedIn && i === 1 && "hidden"
              }`}
            >
              <span className="text-orange-500">{el.icon}</span>
              <p className="mt-1">
                :{" "}
                {i === 0 ? (
                  <a
                    href={`mailto:${el.info}`}
                    className="text-blue-600 hover:underline underline-offset-2"
                  >
                    {el.info}
                  </a>
                ) : (
                  <span className="text-blue-600">{el.info}</span>
                )}
              </p>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default SeeProfile;
