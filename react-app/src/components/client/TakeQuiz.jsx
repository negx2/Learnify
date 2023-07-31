import React, { useState } from "react";
import AWS from "aws-sdk";
import { questions } from "./../HelperFuncs/sampleQnA.js";
import QuizPlayer from "./QuizPlayer.jsx";
import axios from "axios";

const lambda = new AWS.Lambda({
  region: "us-east-2",
  accessKeyId: "AKIA2JAGLUTTUOKMHGFF",
  secretAccessKey: "iIJCuVESeZA2K1KP6JJpzkPr7hFOURcACU3Kdwym",
});

const TranscriptForUsers = () => {
  const [youtubeLinkInput, setYoutubeLinkInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [quiz, setQuiz] = useState("");
  const [fetchStatus, setFetchStatus] = useState("No quizzes to show!");

  const fetchYoutubeCaption = async (link, setDisplayValue) => {
    const response = await axios.get(
      `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod/fetch-youtube-caption?url=${link}`
    );
    console.log("RES", response);
    return response.data.transcript;
  };
  // https://www.youtube.com/watch?v=u7pu1cQBqtQ

  const handleInputChange = (event) => {
    setTranscript(event.target.value);
  };

  const handleLinkChange = (e) => {
    setYoutubeLinkInput(e.target.value);
  };

  const generateQuiz = async () => {
    try {
      // clear quiz
      setQuiz("");

      setFetchStatus("Fetching quiz...");
      const response = await axios.get(
        `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod/make-quiz?transcript=${transcript}`
      );

      // const response = await lambda.invoke(params).promise();
      // console.log("Response:", response);
      // const parsedResponse = JSON.parse(response.Payload.body);
      console.log("Parsed response:", response);
      // setQuiz(parsedResponse);
      setQuiz(response.data.quiz.questions);
    } catch (error) {
      // console.error("Error invoking Lambda function:", error);
      setFetchStatus("Error: " + error.message);
    }
  };

  const retreiveScript = async () => {
    setTranscript("Fetching Transcript ...");
    const incomingTranscript = await fetchYoutubeCaption(
      youtubeLinkInput,
      setTranscript
    );
    setTranscript(incomingTranscript);
  };

  return (
    <div className="mainClass">
      <div className="inputSide">
        <div>
          <input
            type="text"
            value={youtubeLinkInput}
            // value={"https://www.youtube.com/watch?v=qD0_yWgifDM"}
            onChange={handleLinkChange}
            placeholder="Video link here..."
          ></input>
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
          readOnly
        ></textarea>

        <div className="btnsDiv">
          <button className="generateBTN" onClick={generateQuiz}>
            Generate Quiz
          </button>
        </div>
      </div>

      <hr />
      <div className="outputSide">
        {quiz ? <QuizPlayer questions={quiz} /> : <div>{fetchStatus}</div>}
      </div>
    </div>
  );
};

export default TranscriptForUsers;
