import json
from enum import Enum


class ErrorTypes(Enum):
    INVALID_JSON_FORMAT = "Invalid JSON format."
    MISSING_QUIZ_TITLE = "Missing 'quiz_title' in quiz JSON."
    MISSING_QUESTIONS = "Missing 'questions' in quiz JSON."
    MISSING_QUESTION_NUMBER = "Missing 'question_number' in question."
    MISSING_QUESTION_TEXT = "Missing 'question_text' in question."
    MISSING_CHOICES = "Missing 'choices' in question."
    MISSING_CHOICE_TEXT = "Missing 'choice_text' in choice."
    MISSING_IS_CORRECT = "Missing 'is_correct' in choice."
    INVALID_CHOICE_COUNT = "A question must have at least 2 choices."
    INVALID_CORRECT_CHOICE_COUNT = "A question must have at least one correct choice."
    INVALID_QUESTION_NUMBER_SEQUENCE = "Question numbers must start from 1 and increase monotonically."


def longest_json_substr(text):
    # TODO: support parsing out curly braces in prefix and suffix

    max_length = 0
    max_subtext = ""
    stack = []
    subtext = ""

    for char in text:
        if char == "{":
            stack.append(char)
            subtext += char
        elif char == "}":
            if len(stack) > 0:
                stack.pop()
                subtext += char

                if len(stack) == 0 and len(subtext) > max_length:
                    max_length = len(subtext)
                    max_subtext = subtext
            else:
                stack = []
                subtext = ""
        else:
            if len(stack) > 0:
                subtext += char

    return max_subtext


def validate_quiz_json(json_string):
    try:
        quiz = json.loads(longest_json_substr(json_string))
    except json.JSONDecodeError as e:
        raise Exception(f"{ErrorTypes.INVALID_JSON_FORMAT.value}\n{e}")

    if "quiz_title" not in quiz or not isinstance(quiz['quiz_title'], str):
        raise Exception(ErrorTypes.MISSING_QUIZ_TITLE.value)

    if "questions" not in quiz or not isinstance(quiz['questions'], list):
        raise Exception(ErrorTypes.MISSING_QUESTIONS.value)

    for i, question in enumerate(quiz["questions"], start=1):
        if "question_number" not in question or not isinstance(question['question_number'], int):
            raise Exception(ErrorTypes.MISSING_QUESTION_NUMBER.value)

        if question['question_number'] != i:
            raise Exception(ErrorTypes.INVALID_QUESTION_NUMBER_SEQUENCE.value)

        if "question_text" not in question or not isinstance(question['question_text'], str):
            raise Exception(ErrorTypes.MISSING_QUESTION_TEXT.value)

        if "choices" not in question or not isinstance(question['choices'], list):
            raise Exception(ErrorTypes.MISSING_CHOICES.value)

        if len(question['choices']) < 2:
            raise Exception(ErrorTypes.INVALID_CHOICE_COUNT.value)

        correct_choices = 0
        for choice in question["choices"]:
            if "choice_text" not in choice or not isinstance(choice['choice_text'], str):
                raise Exception(ErrorTypes.MISSING_CHOICE_TEXT.value)

            if "is_correct" not in choice or not isinstance(choice['is_correct'], bool):
                raise Exception(ErrorTypes.MISSING_IS_CORRECT.value)

            if choice["is_correct"]:
                correct_choices += 1

        if correct_choices < 1:
            raise Exception(ErrorTypes.INVALID_CORRECT_CHOICE_COUNT.value)

    return quiz
