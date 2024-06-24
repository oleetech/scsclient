import React from "react";
import PageHeader from "../../../../components/PageHeader";
import BillGenerate from "./components/BillGenerate";

const Bill = () => {
  return (
    <>
      <PageHeader title="Generate Bill" />

      <BillGenerate />
      <div className="h-12" />
    </>
  );
};

export default Bill;
