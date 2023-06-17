import os
import openai
import boto3
from format_validator import validate_quiz_json

openai.api_key = os.getenv("OPENAI_API_KEY")


def generate_quiz(transcript, logger):
    next_quiz_id = getMaxId() + 1
    quiz = fetchQuiz(transcript)

    try:
        quiz_json = validate_quiz_json(quiz)
        quiz_json['quiz_id'] = next_quiz_id
    except Exception as e:
        logger.error(
            f"Error validating quiz json to insert with quiz_id={next_quiz_id}: \nError message:\n{e} \nReturned Quiz:\n{quiz}")
        raise e

    saveQuiz(quiz_json)

    return quiz


instruction = """
Make a multiple choice quiz based on the user's transcript. Your quiz should have about 5 questions with 2 or 3 options for each question. Try to make the quiz title witty and the questions entertaining. Your response should be in json format. The json should have the keys 'quiz_title' and 'questions'. Each question should have the keys 'question_number', 'question_text' and 'choices'. Each choice should have a key 'choice_text' and 'is_correct'. Choice text should only be no more than 8 words. The value of 'is_correct' should be either true or false. The value of 'question_number' should be an integer. The value of 'question_text' and 'choice_text' should be a string.
"""


def buildPrompt(transcript):
    return f"{instruction}\n\nTranscript:\n###\n{transcript}\n###\n"


def saveQuiz(quiz):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('quizzes')
    table.put_item(Item=quiz)


def getMaxId():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('quizzes')
    response = table.scan(ProjectionExpression='quiz_id')
    max_id = getMaxIdFromList(response)
    while 'LastEvaluatedKey' in response:
        response = table.scan(
            ExclusiveStartKey=response['LastEvaluatedKey'], ProjectionExpression='quiz_id')
        max_id = getMaxIdFromList(response, max_id)
    return max_id


def getMaxIdFromList(response_list, max_id=1):
    for item in response_list['Items']:
        if item['quiz_id'] > max_id:
            max_id = item['quiz_id']
    return max_id


def fetchQuiz(transcript, instruction=instruction):
    # prompt = buildPrompt(transcript)
    messages = [{"role": "system", "content": instruction},
                {"role": "user", "content": transcript}]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.3,
        max_tokens=1000,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    return response.choices[0].message['content']
