import logging
from open_ai_generator import generate_quiz
import updater


# create logger
logger = logging.getLogger('learnify')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


STATUS_OK = 200
STATUS_BAD_REQUEST = 400
STATUS_INTERNAL_SERVER_ERROR = 500


def create_response(status_code, body):
    return {
        'statusCode': status_code,
        'body': body
    }


def create_error_response(status_code, error_message):
    return create_response(status_code, {"error_message": error_message})


def lambda_handler(event, context):
    if 'transcript' in event:
        try:
            quiz = generate_quiz(event['transcript'], logger)
            return create_response(STATUS_OK, quiz)
        except Exception as e:
            error_message = "Error: 500 - Internal Server Error: Failed to create a valid quiz. Please try again with a different transcript."
            return create_error_response(STATUS_INTERNAL_SERVER_ERROR, error_message)
    elif 'updated_quiz' in event:
        try:
            updated_quiz = updater.update_quiz(event['updated_quiz'])
            return create_response(STATUS_OK, updated_quiz)
        except Exception as e:
            error_message = "Error: 500 - Internal Server Error: Failed to update quiz: "
            return create_error_response(STATUS_INTERNAL_SERVER_ERROR, error_message + str(e))
    else:
        error_message = "Error: 400 - Bad Request: Invalid request parameters"
        return create_error_response(STATUS_BAD_REQUEST, error_message)
