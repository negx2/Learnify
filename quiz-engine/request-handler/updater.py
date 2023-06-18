
import boto3
from format_validator import validate_quiz_json
from errors import InputError
import logging

logger = logging.getLogger(__name__)


def fetchQuiz(quiz_id):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('quizzes')
        response = table.get_item(
            Key={'quiz_id': quiz_id}
        )
        quiz = response.get('Item')
        return quiz
    except KeyError as e:
        raise InputError(f"Quiz id not found: quiz_id={quiz_id}") from e
    except Exception as e:
        logger.error(
            f"Failed to fetch quiz for input quiz_id: {quiz_id} \nException: {e}")
        raise Exception(
            f"Failed to fetch quiz for quiz_id: {quiz_id}")


def saveQuiz(quiz):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('quizzes')
    table.put_item(Item=quiz)


def update_quiz(new_quiz):
    validate_quiz_json(new_quiz)

    fetched_quiz = fetchQuiz(new_quiz['quiz_id'], logger)

    try:
        validate_quiz_json(fetched_quiz)
        if len(new_quiz['questions']) != len(fetched_quiz['questions']):
            raise InputError(
                f"Number of questions in new update ({len(new_quiz['questions'])}) does not match number of questions in existing quiz ({len(fetched_quiz['questions'])}) .")
    except Exception as e:
        logger.info(
            f"Replaced corrupted quiz with new quiz for quiz_id={new_quiz['quiz_id']} \nOld Quiz:\n{fetched_quiz} \nNew Quiz:\n{new_quiz}")

    saveQuiz(new_quiz)

    return True
