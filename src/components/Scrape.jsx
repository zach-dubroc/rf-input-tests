const ScrapedResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/scrape/scrape/leads"
        );
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

    fetchResults();
  }, []);

  if (loading) return <p>Loading scraped results...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Scraped Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>URL:</strong> {result.url}
            <br />
            <strong>Phone Numbers:</strong>{" "}
            {result.phone_numbers ? result.phone_numbers.join(", ") : "N/A"}
            <br />
            <strong>Emails:</strong>{" "}
            {result.emails ? result.emails.join(", ") : "N/A"}
            <br />
            <strong>Company Name:</strong> {result.company_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScrapedResults;
