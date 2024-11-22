import React from "react";
import QueryForm from "./QueryForm";

const Dashboard = () => {
  const firstname = localStorage.getItem("firstname");

  return (
    <div className="dashboard-main">
      <h1>hi, {firstname}!</h1>
      <p>start generating leads:</p>
      <QueryForm />
    </div>
  );
};

export default Dashboard;
