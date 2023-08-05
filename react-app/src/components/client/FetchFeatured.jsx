import React, { useState, useEffect } from "react";
import FetchQuiz from "./FetchQuiz.jsx";

const FetchFeatured = () => {
  const [featured, setFeatured] = useState({
    quizzes: [{ quiz_id: "0", quiz_title: "Test" }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizId, setQuizId] = useState("");

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod/fetch-featured`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFeatured(data);
    } catch (error) {
      console.log("ERR is", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchFeatured();
  // }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>ERROR: {error}</div>}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflow: "auto",
          scroll: "smooth",
        }}
      >
        {featured.quizzes.map((card) => (
          <div
            onClick={() => setQuizId(card.quiz_id)}
            key={card.quiz_id}
            style={{
              width: "150px",
              height: "150px",
              border: "1px solid black",
              margin: "10px",
              padding: "3px",
            }}
          >
            {card.quiz_title}
          </div>
        ))}
      </div>
      {quizId ? <FetchQuiz quizId={quizId} /> : null}
    </div>
  );
};

export default FetchFeatured;
