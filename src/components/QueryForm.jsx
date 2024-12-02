import React, { useState } from "react";
import Scrape from "./Scrape";

const QueryForm = () => {
  const [queryData, setQueryData] = useState({
    keywords: "",
    industry: "",
    location: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/query/post-business-detail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "failed to submit query.");
      }
      alert("query submitted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        location: queryData.location,
      });
      const response = await fetch(
        `http://127.0.0.1:5000/query/get-business-detail?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "failed to fetch results.");
      }

      setResults(data.businesses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-form-container">
      <h2>-leadgen input testing-</h2>
      <h3>contact info and urls only pulled from google places api</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleQuery();
        }}
      >
        <div>
          <label htmlFor="keywords">keywords:</label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            placeholder="e.g., saas companies"
            value={queryData.keywords}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="industry">industry:</label>
          <input
            type="text"
            id="industry"
            name="industry"
            placeholder="e.g., software"
            value={queryData.industry}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">location:</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g., san francisco"
            value={queryData.location}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "submitting..." : "submit"}
        </button>
        <button
          type="button"
          onClick={fetchResults}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "fetching..." : "fetch results"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <Scrape results={results} />
    </div>
  );
};

export default QueryForm;
