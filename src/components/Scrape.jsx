import React, { useEffect, useState } from "react";

const Scrape = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScrapedData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://127.0.0.1:5000/scrape/leads", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || "Failed to fetch scraped data.");
        }

        setResults(data.scraped_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapedData();
  }, []);

  if (loading) {
    return <p>Loading scraped results...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!results || results.length === 0) {
    return <p>No results available.</p>;
  }

  return (
    <div>
      <h2>Scraped Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>URL:</strong> {result.url}
            <br />
            <strong>Phone Numbers:</strong>{" "}
            {Array.isArray(result.phone_numbers)
              ? result.phone_numbers.join(", ")
              : "N/A"}
            <br />
            <strong>Emails:</strong>{" "}
            {Array.isArray(result.emails) ? result.emails.join(", ") : "N/A"}
            <br />
            <strong>Company Name:</strong> {result.company_name || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scrape;
