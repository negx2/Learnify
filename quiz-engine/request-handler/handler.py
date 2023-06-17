import logging
from open_ai_generator import generate_quiz


# create logger
logger = logging.getLogger('learnify')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)


def lambda_handler(event, context):
    if event['transcript']:
        try:
            quiz = generate_quiz(event['transcript'], logger)
            return {
                'statusCode': 200,
                'body': quiz
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': 'Error: 500 - Internal Server Error: Failed to create a valid quiz. Please try again with a different transcript.'
            }
    else:
        return {
            'statusCode': 400,
            'body': 'Invalid request parameters'
        }
