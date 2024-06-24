import React from "react";
import PageHeader from "../../../components/PageHeader";
import ManageExcel from "./components/ManageExcel";

const Manage = () => {
  return (
    <>
      <PageHeader
        title="Manage Manifest and Bill generate"
        subtitle="Manage your manifests and generate bill."
      />
      <ManageExcel />
    </>
  );
};

export default Manage;
