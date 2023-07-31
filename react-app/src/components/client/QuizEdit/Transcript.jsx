import React, { useState } from "react";
import AWS from "aws-sdk";
import QuizEditor from "./QuizEditor.jsx";
import { questions } from "./../../HelperFuncs/sampleQnA.js";
import axios from "axios";

const lambda = new AWS.Lambda({
  region: "us-east-2",
  accessKeyId: "AKIA2JAGLUTTUOKMHGFF",
  secretAccessKey: "iIJCuVESeZA2K1KP6JJpzkPr7hFOURcACU3Kdwym",
});

const TranscriptForCreators = () => {
  // const [quizQuestions, setQuizQuestions] = useState(questions);
  const [youtubeLinkInput, setYoutubeLinkInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [quiz, setQuiz] = useState("");
  const [quizBackup, setQuizBackup] = useState("");
  const [fetchStatus, setFetchStatus] = useState("No quizzes to show!");

  const fetchYoutubeCaption = async (link, setDisplayValue) => {
    const response = await axios.get(
      `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod/fetch-youtube-caption?url=${link}`
    );
    return response.data.transcript;
  };

  const handleInputChange = (event) => {
    setTranscript(event.target.value);
  };

  const handleLinkChange = (e) => {
    setYoutubeLinkInput(e.target.value);
  };

  const generateQuiz = async () => {
    try {
      setQuiz("");

      setFetchStatus("Fetching quiz...");
      // const response = await axios.get(
      //   `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod/make-quiz?transcript=${transcript}`
      // );
      // setQuiz(response.data.quiz.questions);
      // setQuizBackup(response.data.quiz.questions);
      setQuiz(questions); // should be quiz object that has id and title
      setQuizBackup(JSON.parse(JSON.stringify(questions)));
    } catch (error) {
      setFetchStatus("Error: " + error.message);
    }
  };

  const retreiveScript = async () => {
    setTranscript("Fetching Editable Transcript ...");
    const incomingTranscript = await fetchYoutubeCaption(
      youtubeLinkInput,
      setTranscript
    );
    setTranscript(incomingTranscript);
  };

  const updateQuestion = (qID, updatedQ) => {
    questions[qID].question_text = updatedQ;
    // setQuiz(questions); // then... save into db
  };

  const updateChoices = (qID, choiceID, updatedAns, contentTruth) => {
    console.log("ANS", updatedAns);
    questions[qID].choices[choiceID].choice_text = updatedAns;
    questions[qID].choices[choiceID].is_correct = contentTruth;
    // setQuiz(questions); // then... save into db
  };

  const restoreQnA = (ID) => {
    console.log("Q", quizBackup);
    setQuiz(JSON.parse(JSON.stringify(quizBackup)));
  };

  return (
    <div className="mainClass">
      <div className="inputSide">
        <div>
          <input
            type="link"
            value={youtubeLinkInput}
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
        ></textarea>

        <div className="btnsDiv">
          <button className="generateBTN" onClick={generateQuiz}>
            Generate Quiz
          </button>
        </div>
      </div>
      <hr />
      <div className="outputSide">
        {quiz ? (
          <QuizEditor
            questions={quiz}
            updateQuestion={updateQuestion}
            updateChoices={updateChoices}
            restoreQnA={restoreQnA}
          />
        ) : (
          <div>{fetchStatus}</div>
        )}
      </div>
    </div>
  );
};

export default TranscriptForCreators;
