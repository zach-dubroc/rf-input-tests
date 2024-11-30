import React from "react";

const Scrape = ({ results }) => {
  if (!results || results.length === 0) return <p>no results available.</p>;

  return (
    <div>
      <h2>business details</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>name:</strong> {result.name || "n/a"}
            <br />
            <strong>address:</strong> {result.address || "n/a"}
            <br />
            <strong>phone:</strong> {result.phone_number || "n/a"}
            <br />
            <strong>website:</strong> {result.website || "n/a"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scrape;
