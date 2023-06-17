from handler import lambda_handler
import sample_transcripts
from moto import mock_dynamodb
import boto3
import unittest.mock as mock
import logging
import json

# Create a logger
logger = logging.getLogger("test_logger")
logger.setLevel(logging.DEBUG)
logging_file_handler = logging.FileHandler("log_test_hanlder")
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
        }]
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
def test_lambda_handler_200(mocked_openai):
    logger.info("\n\n===== Starting test_lambda_handler_200 =====\n")

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
        'body'] == sample_transcripts.sampleQuizText(), f"Expected body: {sample_transcripts.sampleQuizText()}, Actual body: {response['body']}"

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
def test_lambda_handler_500(mocked_openai, caplog):
    logger.info("\n\n===== Starting test_lambda_handler_500 =====\n")

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
