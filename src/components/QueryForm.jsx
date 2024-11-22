import React, { useState } from "react";

const QueryForm = () => {
  const [queryData, setQueryData] = useState({
    keywords: "",
    industry: "",
    location: "",
  });
  const [useMyLocation, setUseMyLocation] = useState(false);
  const [response, setResponse] = useState(null);
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
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/url_query/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryData),
      });

      const result = await res.json();
      if (res.ok) {
        setResponse(result);
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-form-container">
      <h2>First, what sort of leads are you looking for?</h2>
      <br></br>
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
          {loading ? "Loading..." : "Search"}
        </button>
      </form>
      {response && (
        <div className="response-container">
          <h3>Results:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default QueryForm;
