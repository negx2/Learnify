import React, { useState } from 'react';


const fetchYoutubeCaption = async (link, setDisplayValue) => {
  const response = await fetch(
    `https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod/fetch-youtube-caption?url=${link}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.transcript;
}


const YoutubeTest = () => {
  const [youtubeLinkInput, setYoutubeLinkInput] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  const handleChange = (e) => {
    setYoutubeLinkInput(e.target.value);
  };

  const handleClick = async () => {
    setDisplayValue("Fetching Transcript for -> " + youtubeLinkInput);

    const transcript = await fetchYoutubeCaption(youtubeLinkInput, setDisplayValue);

    setDisplayValue(transcript);

  };

    return (
        <div>
          <h1>Youtube Transcript</h1>
          <input type="text" value={youtubeLinkInput} onChange={handleChange} />
          <button onClick={handleClick}>Fetch Transcript</button>
          <div>{displayValue}</div>
        </div>
    );
};

export default YoutubeTest;