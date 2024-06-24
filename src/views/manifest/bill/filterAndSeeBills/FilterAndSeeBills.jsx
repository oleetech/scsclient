import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import MawbFilter from "./components/MawbFilter";
import DateFilter from "./components/DateFilter";
import MonthYearFilter from "./components/MonthYearFilter";
import CustomerFilter from "./components/CustomerFilter";
import CusMonthFilter from "./components/CusMonthFilter";

const FilterAndSeeBills = () => {
  const [toggleState, setToggleState] = useState(1);
  const changeTab = (tabs) => {
    setToggleState(tabs);
  };
  const tablist = [
    {
      id: 1,
      title: "MAWB",
    },
    {
      id: 2,
      title: "Date",
    },
    {
      id: 3,
      title: "Month-Year",
    },
    {
      id: 4,
      title: "Customer",
    },
    {
      id: 5,
      title: "Month-Customer",
    },
  ];
  return (
    <>
      <PageHeader
        title="Filter Bills or Download"
        subtitle="Select any filtration method and filter bills or download them as PDF."
      />

      <div
        role="tablist"
        className="tabs tabs-bordered text-[28px] md:w-max mx-2 md:mx-auto flex flex-row flex-wrap justify-center"
      >
        {tablist.map((el) => {
          return (
            <p
              key={el.id}
              role="tab"
              className={`tab ${toggleState === el.id && "tab-active"}`}
              onClick={() => {
                changeTab(el.id);
              }}
            >
              {el.title}
            </p>
          );
        })}
      </div>

      {/* Tabs */}
      <>
        {toggleState === 1 ? (
          <MawbFilter />
        ) : toggleState === 2 ? (
          <DateFilter />
        ) : toggleState === 3 ? (
          <MonthYearFilter />
        ) : toggleState === 4 ? (
          <CustomerFilter />
        ) : (
          <CusMonthFilter />
        )}
      </>
    </>
  );
};

export default FilterAndSeeBills;
