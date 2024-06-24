import React from "react";
import UploadExcel from "./UploadExcel";
import PageHeader from "../../../components/PageHeader";

const Manifest = () => {
  return (
    <>
      <PageHeader
        title="Handle Daily Manifest"
        subtitle="Upload your yesterday's manifest here."
      />
      <UploadExcel />
    </>
  );
};

export default Manifest;
