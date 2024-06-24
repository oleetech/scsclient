import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import CustomerTable from "./components/CustomerTable";
import { countCustomer } from "./components/CountCustomers";

const Customers = () => {
  const [customerCount, setCustomerCount] = useState(0);
  useEffect(() => {
    const fetchCustomerCount = async () => {
      const count = await countCustomer();
      setCustomerCount(count);
    };

    fetchCustomerCount();
  }, []);
  return (
    <>
      <PageHeader
        title="Total Customers"
        subtitle="You are viewing the total number of customers. Customer detail's can be edited at any time."
      />

      <p className="text-[#0084FF] text-lg border-b-2 border-[#0084FF] px-2 w-max">
        Total Customers - {customerCount}
      </p>

      <CustomerTable />
    </>
  );
};

export default Customers;
