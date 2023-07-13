from handler import lambda_handler
import sample_transcripts
from moto import mock_dynamodb
import boto3
import unittest.mock as mock
import logging
import json
from utils import QuizUpdater

# Create a logger
logger = logging.getLogger("test_logger")
logger.setLevel(logging.DEBUG)
logging_file_handler = logging.FileHandler("log_test_hanlder", mode='w')
logging_file_handler.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
logging_file_handler.setFormatter(formatter)
logger.addHandler(logging_file_handler)


sample_entry = {
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


def createTable(table_name):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{'AttributeName': 'quiz_id', 'KeyType': 'HASH'}],
        AttributeDefinitions=[
            {'AttributeName': 'quiz_id', 'AttributeType': 'N'}],
        ProvisionedThroughput={'ReadCapacityUnits': 1, 'WriteCapacityUnits': 1}
    )
    table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
    return table


def saveToTable(table_name, quiz_data):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    table.put_item(Item=quiz_data)


def readFromTable(table_name, quiz_id):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    response = table.get_item(Key={'quiz_id': quiz_id})
    return response['Item']


# print all items in table (for debugging)
def printTableItems(table_name):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    response = table.scan()
    print(response['Items'])


def countTableItems(table_name):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    response = table.scan()
    return response['Count']


@ mock_dynamodb
@ mock.patch('openai.ChatCompletion.create', return_value=sample_transcripts.mockedQuizResponse())
def test_generate_quiz_returns_200(mocked_openai):
    logger.info(f"\n\n===== Starting test_generate_quiz_returns_200 =====\n")

    # Create a mock DynamoDB table
    createTable('quizzes')
    saveToTable('quizzes', sample_entry)

    event = {'transcript': sample_transcripts.cdTranscriptSummary()}
    context = {}

    # Invoke the Lambda handler
    response = lambda_handler(event, context)

    # Perform assertions on the response
    assert response[
        'statusCode'] == 200, f"Expected status code: 200, Actual status code: {response['statusCode']}"
    assert response[
        'body']['quiz'] == sample_transcripts.sampleQuizText(), f"Expected body to contain quiz: {sample_transcripts.sampleQuizText()}, Actual body: {response['body']}"

    mocked_openai.assert_called_once(
    ), f"Expected mocked_openai to be called once, Actual mocked_openai called: {mocked_openai.call_count}"

    expected_quiz_id = sample_entry['quiz_id'] + 1
    expected_quiz_data = json.loads(sample_transcripts.sampleQuizText())
    expected_quiz_data["quiz_id"] = expected_quiz_id

    read_quiz_data = readFromTable('quizzes', expected_quiz_id)
    logger.info(f"read_quiz_data:\n {read_quiz_data}")

    assert read_quiz_data == expected_quiz_data, f"Expected body: {expected_quiz_data}, Actual body: {read_quiz_data}"


@ mock_dynamodb
@ mock.patch('openai.ChatCompletion.create', return_value=sample_transcripts.mockedQuizResponse(responseText="non json response"))
def test_generate_quiz_returns_500(mocked_openai, caplog):
    logger.info(f"\n\n===== test_generate_quiz_returns_500 =====\n")

    caplog.set_level(logging.ERROR)

    # Create a mock DynamoDB table
    createTable('quizzes')

    event = {'transcript': sample_transcripts.cdTranscriptSummary()}
    context = {}

    # Invoke the Lambda handler
    response = lambda_handler(event, context)
    logs = caplog.records

    # Perform assertions on the response
    expected_error_code = 500
    expected_error_message = f"Error: {expected_error_code} - Internal Server Error"
    assert response[
        'statusCode'] == expected_error_code, f"Expected status code: {expected_error_code}, Actual status code: {response['statusCode']}"
    assert expected_error_message in response[
        'body']['error_message'], f"Expected error message: {expected_error_message}, Actual body: {response['body']}"

    mocked_openai.assert_called_once(
    ), f"Expected mocked_openai to be called once, Actual mocked_openai called: {mocked_openai.call_count}"
    assert (countTableItems('quizzes') ==
            0), f"Expected table count: 0, Actual table count: {countTableItems('quizzes')}"

    assert len(
        logs) == 2, f"Expected 1 log, Actual: {len(logs)} \n {[log.message for log in logs]}"
    assert "non json response" in logs[
        1].message, f"Expected openai response in log message: {logs[1].message}"


@ mock_dynamodb
def test_update_quiz_returns_200():
    logger.info(f"\n\n===== Starting test_update_quiz_returns_200 =====\n")

    # Create a mock DynamoDB table
    createTable('quizzes')
    saveToTable('quizzes', sample_entry)

    modified_quiz = QuizUpdater(sample_entry).update_quiz_title(
        "new title").update_question_text(1, "new question text").get_quiz()

    event = {'update_quiz': modified_quiz}
    context = {}

    # Invoke the Lambda handler
    response = lambda_handler(event, context)

    # sanity check that quiz is indeed modified
    assert sample_entry != modified_quiz, f"Expected sample_entry to be different from modified_quiz: \nsample_entry:\n{sample_entry}, \nmodified_quiz:\n {modified_quiz}"

    # Perform assertions on the response
    assert response[
        'statusCode'] == 200, f"Expected response to contain statusCode:200: Actual response: {response}"
    assert response[
        'body']['done'] == True, f"Expected body to contain done: True, Actual body: {response['body']}"

    read_quiz_data = readFromTable('quizzes', sample_entry['quiz_id'])
    logger.info(f"read_quiz_data:\n {read_quiz_data}")
    assert read_quiz_data == modified_quiz, f"Expected read_quiz_data to be same as modified_quiz: \nmodified_quiz:\n{modified_quiz}, \nread_quiz_data:\n {read_quiz_data}"


some_internal_error_message = "some internal xyz123 error"


@ mock_dynamodb
@ mock.patch('updater.update_quiz', side_effect=Exception(some_internal_error_message))
def test_update_quiz_internal_error_returns_500(mocked_updater, caplog):
    logger.info(
        f"\n\n===== Starting test_update_quiz_internal_error_returns_500 =====\n")

    caplog.set_level(logging.ERROR)

    event = {'update_quiz': sample_entry}
    context = {}

    # Invoke the Lambda handler
    response = lambda_handler(event, context)
    logs = caplog.records

    # Perform assertions on the response
    expected_error_code = 500
    expected_error_message = f"Error: {expected_error_code} - Internal Server Error"
    assert response[
        'statusCode'] == expected_error_code, f"Expected response to contain status code: {expected_error_code}, Actual response: {response}"

    assert expected_error_message in response['body'][
        'error_message'], f"Expected response to contain error message: {expected_error_message}, Actual response: {response}"

    mocked_updater.assert_called_once_with(sample_entry)

    assert len(
        logs) == 2, f"Expected 2 logs, Actual: {len(logs)} \n {[log.message for log in logs]}"
    assert some_internal_error_message in logs[
        1].message, f"Expected error message: {some_internal_error_message}, Actual log: {logs[1].message}"


@ mock_dynamodb
def test_update_quiz_missing_id_returns_400():
    logger.info(
        "\n\n===== Starting test_update_quiz_missing_id_returns_400 =====\n")

    # Create a mock DynamoDB table
    createTable('quizzes')
    saveToTable('quizzes', sample_entry)

    modified_quiz = QuizUpdater(sample_entry).update_quiz_id(
        sample_entry['quiz_id'] + 1).get_quiz()

    event = {'update_quiz': modified_quiz}
    context = {}

    # Invoke the Lambda handler
    response = lambda_handler(event, context)

    # assert saved quiz is not modified
    assert sample_entry != modified_quiz, f"Expected sample_entry to be different from modified_quiz: \nsample_entry:\n{sample_entry}, \nmodified_quiz:\n {modified_quiz}"
    read_quiz_data = readFromTable('quizzes', sample_entry['quiz_id'])
    logger.info(f"read_quiz_data:\n {read_quiz_data}")
    assert read_quiz_data == sample_entry, f"Expected read_quiz_data to be same as sample_entry: \nsample_entry:\n{sample_entry}, \nread_quiz_data:\n {read_quiz_data}"

    # Perform assertions on the response
    expected_error_code = 400
    expected_error_message = f"Quiz id not found: quiz_id={modified_quiz['quiz_id']}"
    assert response[
        'statusCode'] == expected_error_code, f"Expected response to contain status code: {expected_error_code}, Actual response: {response}"
    assert expected_error_message in response['body'][
        'error_message'], f"Expected response to contain error message: {expected_error_message}, Actual response: {response}"


@ mock_dynamodb
def test_update_quiz_malformed_json_returns_400():
    logger.info(
        "\n\n===== Starting test_update_quiz_malformed_json_returns_400 =====\n")

    # Create a mock DynamoDB table
    createTable('quizzes')
    saveToTable('quizzes', sample_entry)

    modified_quiz = QuizUpdater(sample_entry).update_quiz_id(
        sample_entry['quiz_id'] + 1).get_quiz()
    # malform the quiz
    del modified_quiz['questions'][0]['choices']

    event = {'update_quiz': modified_quiz}
    context = {}

    # Invoke the Lambda handler
    response = lambda_handler(event, context)

    # assert saved quiz is not modified
    assert sample_entry != modified_quiz, f"Expected sample_entry to be different from modified_quiz: \nsample_entry:\n{sample_entry}, \nmodified_quiz:\n {modified_quiz}"
    read_quiz_data = readFromTable('quizzes', sample_entry['quiz_id'])
    logger.info(f"read_quiz_data:\n {read_quiz_data}")
    assert read_quiz_data == sample_entry, f"Expected read_quiz_data to be same as sample_entry: \nsample_entry:\n{sample_entry}, \nread_quiz_data:\n {read_quiz_data}"

    # Perform assertions on the response
    expected_error_code = 400
    expected_error_message = f"Missing 'choices' in question"
    assert response[
        'statusCode'] == expected_error_code, f"Expected response to contain status code: {expected_error_code}, Actual response: {response}"
    assert expected_error_message in response['body'][
        'error_message'], f"Expected response to contain error message: {expected_error_message}, Actual response: {response}"
