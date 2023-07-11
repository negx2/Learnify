import React, { useState, useEffect } from "react";
import QuizPlayer from "./QuizPlayer.jsx";
import parseQuizFromDynamoJson from "../HelperFuncs/Parser.js";

const FetchQuiz = ({ quizId }) => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuizData(null);
    try {
      const response = await fetch(
        `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod//fetch-quiz?id=${quizId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuizData(parseQuizFromDynamoJson(data));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {quizData && (
        <div>
          <div>
            <QuizPlayer questions={quizData.questions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchQuiz;
