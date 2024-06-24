import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  apiUrl,
  isAdminLoggedIn,
  isEmployeeLoggedIn,
} from "../../../ApiUrlAndToken";
import axios from "axios";
import { toast } from "react-toastify";
import { countCustomer } from "../../customer/components/CountCustomers";
import { countUser } from "../../users/components/CountUsers";
import { getAdmins } from "../../admin/AdminList";

const OverviewSection = () => {
  let adminData;
  let userData;
  if (isAdminLoggedIn) {
    adminData = JSON.parse(window.localStorage.getItem("admin"));
  } else if (isEmployeeLoggedIn) {
    userData = JSON.parse(window.localStorage.getItem("employee"));
  }

  const [customer, setCustomer] = useState(0);
  const [users, setUsers] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [counterOn, setCounterOn] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      const count = await countCustomer();
      setCustomer(count);
    };

    const fetchUser = async () => {
      const count = await countUser();
      setUsers(count);
    };

    const fetchAdmin = async () => {
      const admins = await getAdmins();
      setAdmins(admins);
    };

    fetchAdmin();
    fetchUser();
    fetchCustomer();
  }, []);

  const overview = [
    { title: "Users", value: users },
    { title: "Customers", value: customer },
  ];

  const { ref: overviewRef, inView: overviewInView } = useInView({
    triggerOnce: true,
  });

  const { ref: adminRef, inView: adminInView } = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    setCounterOn(overviewInView || adminInView);
  }, [overviewInView, adminInView]);

  return (
    <div className="flex flex-row flex-wrap gap-10 justify-between">
      <div
        ref={overviewRef}
        className="flex flex-row lg:justify-start justify-center flex-wrap gap-5"
      >
        {overview.map((el, i) => {
          return (
            <div
              key={i}
              className="hover:shadow-lg bg-gray-200 p-10 text-center font-semibold rounded-md h-max"
            >
              <p className="text-xl md:text-2xl">
                {el.title}{" "}
                {counterOn && (
                  <span className="text-lg md:text-xl">
                    (
                    <CountUp start={0} end={el.value} duration={2} delay={0} />)
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div
        ref={adminRef}
        className="hover:shadow min-h-full bg-gray-100 p-5 rounded-md"
      >
        <p className="text-lg font-semibold border-b-2 border-slate-300 px-2">
          Admin List{" "}
          {counterOn && (
            <span className="text-base">
              (
              <CountUp start={0} end={admins.length} duration={2} delay={0} />)
            </span>
          )}
        </p>
        {admins.map((el, i) => {
          return (
            <div key={i} className="">
              <p>
                {i + 1}. {el.name}
              </p>
              <p className="pl-3">{el.email}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewSection;
