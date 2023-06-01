

function parseQuizFromDynamoJson(data) {
    let quiz = {}
    quiz["quiz_id"] = data["quiz_id"]["N"]; 
    quiz["quiz_title"]    = data["quiz_title"]["S"];

      quiz["questions"] = []

    for (let questionObject of data.questions) {
      let question = {}
      question["question_number"] = questionObject["M"]["question_number"]["N"];
      question["question_text"] = questionObject["M"]["question_text"]["S"];
      let choices = []
      for (let choiceObject of questionObject["M"]["choices"]["L"]) {
          let choice = {}
          choice["choice_text"] = choiceObject["M"]["choice_text"]["S"];
          choice["is_correct"] = choiceObject["M"]["is_correct"]["BOOL"];
          choices.push(choice);
      }
      question["choices"] = choices;
      quiz["questions"].push(question);
      }
    return quiz;
}

export default parseQuizFromDynamoJson;