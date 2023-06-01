export const questions = [
  {
    question:
      "What is the output of the following code? console.log(2 + '2' + 2);",
    answerOptions: [
      { answerText: "222", isCorrect: true },
      { answerText: "6", isCorrect: false },
      { answerText: "Error", isCorrect: false },
      { answerText: "undefined", isCorrect: false },
    ],
  },
  {
    question: "What is the result of the following expression? 5 * '10'",
    answerOptions: [
      { answerText: "510", isCorrect: false },
      { answerText: "50", isCorrect: true },
      { answerText: "Error", isCorrect: false },
      { answerText: "undefined", isCorrect: false },
    ],
  },
  {
    question: "What is the result of the following expression? typeof NaN",
    answerOptions: [
      { answerText: "number", isCorrect: true },
      { answerText: "string", isCorrect: false },
      { answerText: "object", isCorrect: false },
      { answerText: "undefined", isCorrect: false },
    ],
  },
];
