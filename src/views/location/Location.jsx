import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import LocationTable from "./components/LocationTable";
import UsdToBDT from "../usdtobdt/UsdToBDT";
import SpxParcelRateTable from "../parcelRate/SpxParcelRateTable";

const Location = () => {
  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };

  return (
    <>
      <PageHeader
        title="Location and Cost"
        subtitle="Add or edit location and it's corresponding cost."
      />

      {/* tab */}
      <div
        role="tablist"
        className="tabs tabs-bordered text-[28px] mb-3 w-max mx-auto font-bold"
      >
        <p
          role="tab"
          className={`tab ${toggleState === 1 && "tab-active"}`}
          onClick={() => {
            changeTab(1);
          }}
        >
          USD to BDT
        </p>
        <p
          role="tab"
          className={`tab  ${toggleState === 2 && "tab-active"}`}
          onClick={() => {
            changeTab(2);
          }}
        >
          Others to DAC
        </p>
        <p
          role="tab"
          className={`tab ${toggleState === 3 && "tab-active"}`}
          onClick={() => {
            changeTab(3);
          }}
        >
          SPX Parcel Rate
        </p>
      </div>

      {/* Tab contents */}
      {toggleState === 1 ? (
        <UsdToBDT />
      ) : toggleState === 2 ? (
        <LocationTable />
      ) : (
        <SpxParcelRateTable />
      )}
    </>
  );
};

export default Location;
