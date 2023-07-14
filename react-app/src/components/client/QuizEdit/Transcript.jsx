import React, { useState } from "react";
import AWS from "aws-sdk";
import QuizEditor from "./QuizEditor.jsx";
import { questions } from "./../../HelperFuncs/sampleQnA.js";

const lambda = new AWS.Lambda({
  region: "us-east-2",
  accessKeyId: "AKIA2JAGLUTTUOKMHGFF",
  secretAccessKey: "iIJCuVESeZA2K1KP6JJpzkPr7hFOURcACU3Kdwym",
});

const TranscriptForCreators = () => {
  const [transcript, setTranscript] = useState("");
  const [quiz, setQuiz] = useState("");
  const [fetchStatus, setFetchStatus] = useState("No quizzes to show!");

  const handleInputChange = (event) => {
    setTranscript(event.target.value);
  };

  const generateQuiz = async () => {
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

  const retreiveScript = () => {
    // call lambda fn to get script
    let testScript = "hey hey";
    // update transcript to display incoming script in textarea automatically
    setTranscript(testScript);
  };

  return (
    <div className="mainClass">
      <div className="inputSide">
        <div>
          <input type="link" placeholder="Video link here..."></input>
          <button onClick={retreiveScript}>Get Script</button>
          <br></br>
          <br></br>
        </div>
        <textarea
          rows="10"
          cols="30"
          onChange={handleInputChange}
          value={transcript}
          placeholder="Script..."
        ></textarea>

        <div className="btnsDiv">
          <button className="generateBTN" onClick={generateQuiz}>
            Generate Quiz
          </button>
        </div>
      </div>

      <hr />
      <div className="outputSide">
        {quiz ? <QuizEditor questions={questions} /> : <div>{fetchStatus}</div>}
      </div>
    </div>
  );
};

export default TranscriptForCreators;
