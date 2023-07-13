import React, { useState } from "react";
import AWS from "aws-sdk";
import QuizEditor from "./QuizEditor.jsx";
import { questions } from "./../../HelperFuncs/sampleQnA.js";

const lambda = new AWS.Lambda({
  region: "us-east-2",
  accessKeyId: "AKIA2JAGLUTTUOKMHGFF",
  secretAccessKey: "iIJCuVESeZA2K1KP6JJpzkPr7hFOURcACU3Kdwym",
});

const Transcript = () => {
  const [transcript, setTranscript] = useState("");
  const [quiz, setQuiz] = useState("");
  const [fetchStatus, setFetchStatus] = useState("No quizzes to show!");

  const handleInputChange = (event) => {
    setTranscript(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      // clear quiz
      setQuiz("");

      const payload = {
        queryStringParameters: { transcript: transcript },
      };

      const params = {
        FunctionName: "quiz-engine-lf",
        Payload: JSON.stringify(payload),
      };

      setFetchStatus("Fetching quiz...");

      // const response = await lambda.invoke(params).promise();
      // console.log("Response:", response);
      // const parsedResponse = JSON.parse(response.Payload.body);
      // console.log("Parsed response:", parsedResponse);
      // setQuiz(parsedResponse);
      setQuiz(questions);
    } catch (error) {
      // console.error("Error invoking Lambda function:", error);
      setFetchStatus("Error: " + error.message);
    }
  };

  return (
    <div className="mainClass">
      <div className="inputSide">
        <textarea
          rows="10"
          cols="30"
          onChange={handleInputChange}
          // CONSIDER below onChnage func.... as it needs an event
          // onChange={(e) => {
          //   setTranscript(e.target.value);
          // }}
          placeholder="Paste your content script here..."
        ></textarea>

        <div className="btnsDiv">
          <button className="generateBTN" onClick={handleButtonClick}>
            Generate Quiz
          </button>
        </div>
      </div>

      <hr />
      <div className="outputSide">
        {quiz ? (
          // <QuizPlayer questions={quiz.questions} />
          <QuizEditor questions={questions} />
        ) : (
          <div>{fetchStatus}</div>
        )}
      </div>
    </div>
  );
};

export default Transcript;
