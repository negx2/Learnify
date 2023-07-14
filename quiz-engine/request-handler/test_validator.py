import unittest
import json
from format_validator import validate_quiz_string, ErrorTypes


class TestQuizValidator(unittest.TestCase):
    def setUp(self):
        self.quiz_validator = validate_quiz_string
        self.correct_json_data = '''
        {
            "quiz_title": "Test Quiz",
            "questions": [
                {
                    "question_number": 1,
                    "question_text": "Test question",
                    "choices": [
                        {"choice_text": "Choice 1", "is_correct": false},
                        {"choice_text": "Choice 2", "is_correct": true}
                    ]
                }
            ]
        }
        '''

    def test_valid_quiz(self):
        quiz = self.quiz_validator(self.correct_json_data)
        self.assertIsInstance(quiz, dict)
        self.assertEqual(quiz['quiz_title'], "Test Quiz")

    def test_valid_quiz_with_prefix_and_suffix(self):
        quiz_text = "some prefix" + self.correct_json_data + "some suffix"
        quiz = self.quiz_validator(quiz_text)
        self.assertIsInstance(quiz, dict)
        self.assertEqual(quiz['quiz_title'], "Test Quiz")

    def test_invalid_json_format(self):
        invalid_json_data = '''invalid json data format'''

        with self.assertRaises(Exception) as e:
            self.quiz_validator(invalid_json_data)

        actual_error = str(
            e.exception) if e.exception else "No exception raised"
        self.assertIn(ErrorTypes.INVALID_JSON_FORMAT.value, actual_error,
                      f"Expected error containing: {ErrorTypes.INVALID_JSON_FORMAT.value}, Got: {actual_error}")

    def test_missing_quiz_title(self):
        json_data = json.loads(self.correct_json_data)
        del json_data['quiz_title']
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.MISSING_QUIZ_TITLE.value,
            f"Expected: {ErrorTypes.MISSING_QUIZ_TITLE.value}, Got: {str(e.exception)}")

    def test_missing_questions(self):
        json_data = json.loads(self.correct_json_data)
        del json_data['questions']
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.MISSING_QUESTIONS.value,
            f"Expected: {ErrorTypes.MISSING_QUESTIONS.value}, Got: {str(e.exception)}")

    def test_missing_question_number(self):
        json_data = json.loads(self.correct_json_data)
        del json_data['questions'][0]['question_number']
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.MISSING_QUESTION_NUMBER.value,
            f"Expected: {ErrorTypes.MISSING_QUESTION_NUMBER.value}, Got: {str(e.exception)}")

    def test_invalid_question_number_sequence(self):
        json_data = json.loads(self.correct_json_data)
        json_data['questions'][0]['question_number'] = 2
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.INVALID_QUESTION_NUMBER_SEQUENCE.value,
            f"Expected: {ErrorTypes.INVALID_QUESTION_NUMBER_SEQUENCE.value}, Got: {str(e.exception)}")

    def test_missing_question_text(self):
        json_data = json.loads(self.correct_json_data)
        del json_data['questions'][0]['question_text']
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.MISSING_QUESTION_TEXT.value,
            f"Expected: {ErrorTypes.MISSING_QUESTION_TEXT.value}, Got: {str(e.exception)}")

    def test_missing_choices(self):
        json_data = json.loads(self.correct_json_data)
        del json_data['questions'][0]['choices']
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.MISSING_CHOICES.value,
            f"Expected: {ErrorTypes.MISSING_CHOICES.value}, Got: {str(e.exception)}")

    def test_invalid_choice_count(self):
        json_data = json.loads(self.correct_json_data)
        json_data['questions'][0]['choices'] = [
            {"choice_text": "Choice 1", "is_correct": True}]
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
            self.assertEqual(str(e.exception), ErrorTypes.INVALID_CHOICE_COUNT.value,
                             f"Expected: {ErrorTypes.INVALID_CHOICE_COUNT.value}, Got: {str(e.exception)}")

    def test_missing_choice_text(self):
        json_data = json.loads(self.correct_json_data)
        del json_data['questions'][0]['choices'][0]['choice_text']
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.MISSING_CHOICE_TEXT.value,
            f"Expected: {ErrorTypes.MISSING_CHOICE_TEXT.value}, Got: {str(e.exception)}")

    def test_invalid_correct_choice_count(self):
        json_data = json.loads(self.correct_json_data)
        for choice in json_data['questions'][0]['choices']:
            choice['is_correct'] = False
        with self.assertRaises(Exception) as e:
            self.quiz_validator(json.dumps(json_data))
        self.assertEqual(
            str(e.exception), ErrorTypes.INVALID_CORRECT_CHOICE_COUNT.value,
            f"Expected: {ErrorTypes.INVALID_CORRECT_CHOICE_COUNT.value}, Got: {str(e.exception)}")


if __name__ == "__main__":
    unittest.main()
