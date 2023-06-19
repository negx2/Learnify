import unittest
import unittest.mock as mock
import updater
from utils import QuizUpdater

sample_quiz = {
    "quiz_id": 17,
    "quiz_title": "Know your capitals",
    "questions": [
        {
            "question_number": 1,
            "question_text": "What is the capital of France?",
            "choices": [
                {"choice_text": "Paris", "is_correct": True},
                {"choice_text": "London", "is_correct": False},
                {"choice_text": "New York", "is_correct": False}
            ]
        },
        {
            "question_number": 2,
            "question_text": "What is the capital of Burundi?",
            "choices": [
                {"choice_text": "Bujumbura", "is_correct": True},
                {"choice_text": "London", "is_correct": False},
                {"choice_text": "New York", "is_correct": False}
            ]
        }
    ]
}


class TestQuizUpdater(unittest.TestCase):

    @mock.patch('updater.fetchQuiz', return_value=sample_quiz)
    @mock.patch('updater.saveQuiz', return_value=True)
    def test_update_quiz_success(self, mocked_save, mocked_fetch):

        updated_quiz = QuizUpdater(sample_quiz) \
            .update_quiz_title("Updated title") \
            .update_question_text(1, "Updated question text") \
            .update_choice(1, 1, "Updated choice text", True) \
            .get_quiz()

        assert updated_quiz != sample_quiz
        assert updater.update_quiz(updated_quiz) == True
        mocked_save.assert_called_once_with(updated_quiz)
        mocked_fetch.assert_called_once_with(updated_quiz['quiz_id'])

    @mock.patch('updater.fetchQuiz', side_effect=Exception("Quiz not found"))
    @mock.patch('updater.saveQuiz', return_value=True)
    def test_update_quiz_id_missing_propagates_exception(self, mocked_save, mocked_fetch):
        udpated_quiz = QuizUpdater(sample_quiz) \
            .update_quiz_id(18) \
            .get_quiz()

        self.assertRaises(Exception,
                          updater.update_quiz, udpated_quiz)
        mocked_save.assert_not_called()

    @mock.patch('updater.fetchQuiz', return_value=sample_quiz)
    @mock.patch('updater.saveQuiz', return_value=True)
    def test_invalid_json_raises(self, mocked_save, mocked_fetch):
        udpated_quiz = QuizUpdater(sample_quiz).get_quiz().pop('quiz_id')

        self.assertRaises(Exception,
                          updater.update_quiz, udpated_quiz)
        mocked_save.assert_not_called()
        mocked_fetch.assert_not_called()

    @mock.patch('updater.fetchQuiz', return_value=sample_quiz)
    @mock.patch('updater.saveQuiz', return_value=True)
    def test_different_num_questions_raises(self, mocked_save, mocked_fetch):
        udpated_quiz = QuizUpdater(sample_quiz) \
            .remove_question(1) \
            .get_quiz()

        self.assertRaises(Exception,
                          updater.update_quiz, udpated_quiz)
        mocked_save.assert_not_called()
        mocked_fetch.assert_not_called()
