import React, { useState } from 'react';
import AWS from 'aws-sdk';
import QuizPlayer from "./QuizPlayer";

const lambda = new AWS.Lambda({
  region: 'us-east-2',
  accessKeyId: 'AKIA2JAGLUTTUOKMHGFF',
  secretAccessKey: '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'
});

const Transcript = () => {
  const [transcript, setTranscript] = useState('');
  const [quiz, setQuiz] = useState('');
  const [fetchStatus, setFetchStatus] = useState('No quizzes to show!');


  const handleInputChange = (event) => {
    setTranscript(event.target.value);
  };

  const handleButtonClick = async () => {
    try {
      // clear quiz
      setQuiz('');

      const payload = {
        'queryStringParameters': {'transcript': transcript}
      };

      const params = {
        FunctionName: 'quiz-engine-lf',
        Payload: JSON.stringify(payload)
      };

      setFetchStatus('Fetching quiz...');

      const response = await lambda.invoke(params).promise();
      console.log('Response:', response);
      const parsedResponse = JSON.parse(response.Payload.body);
      console.log('Parsed response:', parsedResponse);
      setQuiz(parsedResponse);

    } catch (error) {
      console.error('Error invoking Lambda function:', error);
      setFetchStatus('Error: ' + error.message);
    }
  };

  return (
    <div>
      <input type="text" value={transcript} onChange={handleInputChange} />
      <button onClick={handleButtonClick}>Send</button>

      {quiz ? <div> <QuizPlayer questions={quiz.questions}  /> </div> : <div>{fetchStatus}</div>}
    </div>
  );
};

export default Transcript;
