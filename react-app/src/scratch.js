const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();


function recursivelyUnmarshall(attributes) {
    if (Array.isArray(attributes)) {
      return attributes.map(item => recursivelyUnmarshall(item));
    }
  
    const unmarshalled = AWS.DynamoDB.Converter.unmarshall(attributes);
  
    for (const key in unmarshalled) {
      if (typeof unmarshalled[key] === 'object') {
        unmarshalled[key] = recursivelyUnmarshall(unmarshalled[key]);
      }
    }
  
    return unmarshalled;
  }

const fetchQuiz = async () => {
    const response = await fetch(`https://xhw9ijramc.execute-api.us-east-2.amazonaws.com/prod//fetch-quiz?id=${8}`);
    const data = await response.json();
    const obj = recursivelyUnmarshall(data);
    console.log(data);
    
    quiz = {}
    quiz["quiz_id"] = data["quiz_id"]["N"]; 
    quiz["quiz_title"]    = data["quiz_title"]["S"];

      quiz["questions"] = []

    for (let questionObject of data.questions) {
      question = {}
      question["question_number"] = questionObject["M"]["question_number"]["N"];
      question["question_text"] = questionObject["M"]["question_text"]["S"];
      choices = []
      for (let choiceObject of questionObject["M"]["choices"]["L"]) {
          choice = {}
          choice["choice_text"] = choiceObject["M"]["choice_text"]["S"];
          choice["is_correct"] = choiceObject["M"]["is_correct"]["BOOL"];
          choices.push(choice);
      }
      question["choices"] = choices;
      quiz["questions"].push(question);
      }

    console.log("---");
    console.log(quiz);
    console.log(quiz.questions[0].choices[0].choice_text);
}

fetchQuiz();


const testItem = {
    "Name": { S: "John Doe" },
    "Age": { N: "30" },
    "Email": { S: "johndoe@example.com" },
    "Address": [
      {"M": {
        "City": { S: "New York" },
        "Country": { S: "USA" }
      }}, 
      {"M": {
        "City": { S: "London" },
        "Country": { S: "England" }
    }}]
  };
const unmarshalledItem = AWS.DynamoDB.Converter.unmarshall(testItem);
console.log(testItem.Name);
console.log({"somelist" : [{"M": {"k1": "v1"}}, {"M": {"k2": "v2"}}]});
console.log(testItem);
testItem.Address.forEach((item) => {
    console.log(item);
});
