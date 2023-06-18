import logging
from open_ai_generator import generate_quiz
from errors import InputError
import updater


# create logger
logger = logging.getLogger('learnify')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)


STATUS_OK = 200
STATUS_BAD_REQUEST = 400
STATUS_INTERNAL_SERVER_ERROR = 500


def create_quiz_response(status_code, quiz):
    return {
        'statusCode': status_code,
        'body': {"quiz": quiz}
    }


def create_done_response(status_code, done):
    return {
        'statusCode': status_code,
        'body': {"done": done}
    }


def create_error_response(status_code, error_message):
    return {
        'statusCode': status_code,
        'body': {"error_message": error_message}
    }


def lambda_handler(event, context):
    if 'transcript' in event:
        try:
            quiz = generate_quiz(event['transcript'])
            return create_quiz_response(STATUS_OK, quiz)
        except Exception as e:
            error_message = "Error: 500 - Internal Server Error: Failed to create a valid quiz. Please try again with a different transcript."
            return create_error_response(STATUS_INTERNAL_SERVER_ERROR, error_message)
    elif 'updated_quiz' in event:
        try:
            updated = updater.update_quiz(event['updated_quiz'])
            return create_done_response(STATUS_OK, updated)
        except InputError as e:
            return create_error_response(STATUS_BAD_REQUEST, str(e))
        except Exception as e:
            error_message = "Error: 500 - Internal Server Error: Failed to update quiz: "
            return create_error_response(STATUS_INTERNAL_SERVER_ERROR, error_message)
    else:
        error_message = "Error: 400 - Bad Request: Invalid request parameters"
        return create_error_response(STATUS_BAD_REQUEST, error_message)
