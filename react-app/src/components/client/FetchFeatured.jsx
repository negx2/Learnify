import React, { useState, useEffect } from "react";

const FetchFeatured = () => {
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);
    setFeatured(null);

    try {
      const response = await fetch(
        `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod/fetch-featured`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFeatured(JSON.stringify(data));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchFeatured}>Fetch Featured Titles</button>

      {loading && <div>Loading...</div>}
      {error && <div>ERROR: {error}</div>}
      {featured && <div> {featured} </div>}
    </div>
  );
};

export default FetchFeatured;
