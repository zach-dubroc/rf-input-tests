import React, { useState } from "react";

const QueryForm = () => {
  const [queryData, setQueryData] = useState({
    keywords: "",
    industry: "",
    location: "",
  });

  const [useMyLocation, setUseMyLocation] = useState(false);
  const [scrapedLeads, setScrapedLeads] = useState(null); // Scraped lead data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setUseMyLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city =
            data.address.city || data.address.town || data.address.state || "";
          setQueryData((prev) => ({
            ...prev,
            location: city,
          }));
        } catch (error) {
          alert("Could not fetch your location.");
          setUseMyLocation(false);
        }
      },
      () => {
        alert("Unable to retrieve location.");
        setUseMyLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScrapedLeads(null);

    try {
      const urlResponse = await fetch("http://127.0.0.1:5000/url_query/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryData),
      });

      const urlResult = await urlResponse.json();
      if (!urlResponse.ok) {
        throw new Error(urlResult.error || "Failed to fetch URLs.");
      }

      const urls = urlResult.urls;

      const scrapeResponse = await fetch("http://127.0.0.1:5000/scrape/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      const scrapeResult = await scrapeResponse.json();
      if (scrapeResponse.ok) {
        setScrapedLeads(scrapeResult.leads);
      } else {
        throw new Error(scrapeResult.error || "Failed to scrape leads.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-form-container">
      <h2>Find Leads</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="keywords">Keywords:</label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            placeholder="e.g., SaaS companies"
            value={queryData.keywords}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="industry">Industry:</label>
          <input
            type="text"
            id="industry"
            name="industry"
            placeholder="e.g., Software"
            value={queryData.industry}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <div className="location-input">
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., San Francisco"
              value={queryData.location}
              onChange={handleChange}
              disabled={useMyLocation}
            />
            <div className="loc-checkbox">
              <input
                type="checkbox"
                id="use-my-location"
                checked={useMyLocation}
                onChange={(e) =>
                  e.target.checked
                    ? handleUseMyLocation()
                    : setUseMyLocation(false)
                }
              />
              <label htmlFor="use-my-location">Use My Location</label>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Fetching and Scraping..." : "Search and Scrape"}
        </button>
      </form>
      {scrapedLeads && scrapedLeads.length > 0 ? (
        <div className="scraped-leads-container">
          <h3>Scraped Leads:</h3>
          <ul>
            {scrapedLeads.map((lead, index) => (
              <li key={index}>
                <strong>URL:</strong> {lead.url}
                <br />
                <strong>Phone Numbers:</strong>{" "}
                {lead.phone_numbers.length > 0
                  ? lead.phone_numbers.join(", ")
                  : "No phone numbers found"}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>...</p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default QueryForm;
