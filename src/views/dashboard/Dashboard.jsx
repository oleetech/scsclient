import React from "react";
import PageHeader from "../../components/PageHeader";
import OverviewSection from "./components/OverviewSection";
import ShortcutSection from "./components/ShortcutSection";

const Dashboard = () => {
  return (
    <>
      <PageHeader title="Overview" />
      <OverviewSection />
      <ShortcutSection />
    </>
  );
};

export default Dashboard;
