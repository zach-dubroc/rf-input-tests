import React from "react";
import QueryForm from "./QueryForm";

const Dashboard = () => {
  const firstname = localStorage.getItem("firstname");

  return (
    <div className="dashboard-main">
      <h1>user: {firstname}</h1>
      <p>
        not scraping functionally yet, but switched to the places api to gather
        the urls and contact info because it's grabbing way more reliable
        name/address/phone info, and taking the urls when they're available into
        a mongo table for the scraper to save some api calls when we're testing
        that
      </p>
      <QueryForm />
    </div>
  );
};

export default Dashboard;
