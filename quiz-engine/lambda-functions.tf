# Define AWS provider
provider "aws" {
  region = "us-east-2"
}

variable "OPENAI_API_KEY" {
  description = "API key for OpenAI"
}

resource "aws_lambda_layer_version" "python_deps_layer" {
  layer_name               = "PythonDependencies"
  compatible_architectures = ["x86_64"]
  compatible_runtimes      = ["python3.10"]

  filename         = "request-handler/python.zip"
  source_code_hash = filebase64sha256("request-handler/python.zip")
}


# Create an AWS Lambda function
resource "aws_lambda_function" "quiz_engine_lf" {
  function_name = "quiz-engine-lf"
  runtime       = "python3.10"
  handler       = "handler.lambda_handler"
  memory_size   = 128
  timeout       = 60
  role          = aws_iam_role.quiz_engine_lf_role.arn
  environment {
    variables = {
      OPENAI_API_KEY         = var.OPENAI_API_KEY
      AWS_LAMBDA_LOGS        = "/aws/lambda/quiz-engine-lf"
      AWS_LAMBDA_LOGS_PREFIX = "/aws/lambda/quiz-engine-lf"

    }
  }

  # Upload the function code from a local zip file
  filename         = "request-handler.zip"
  source_code_hash = filebase64sha256("request-handler.zip")

  # Attach the layer to the function
  layers = [aws_lambda_layer_version.python_deps_layer.arn]

  tracing_config {
    mode = "Active"
  }
}

resource "aws_iam_role" "quiz_engine_lf_role" {
  name = "quiz_engine_lf_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}


resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "lambda_dynamodb_policy"
  description = "Policy for Lambda function to access DynamoDB"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-2:706535466215:table/quizzes"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attachment" {
  role       = aws_iam_role.quiz_engine_lf_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.quiz_engine_lf_role.name
}

resource "aws_iam_role_policy_attachment" "cloudwatch_policy_attachement" {
  role       = aws_iam_role.quiz_engine_lf_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

resource "aws_cloudwatch_log_group" "quiz_engine_log_group" {
  name = "/aws/lambda/${aws_lambda_function.quiz_engine_lf.function_name}"
}


