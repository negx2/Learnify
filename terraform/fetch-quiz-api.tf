
data "aws_dynamodb_table" "quizzes_table" {
  name = "quizzes"
}

resource "aws_api_gateway_resource" "fetch_quiz_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "fetch-quiz"
}

resource "aws_api_gateway_method" "fetch_quiz_method" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.fetch_quiz_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "fetch_quiz_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.fetch_quiz_resource.id
  http_method             = aws_api_gateway_method.fetch_quiz_method.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/GetItem"
  request_templates = {
    "application/json" = <<EOF
{
  "TableName": "quizzes",
  "Key": {
    "quiz_id": { "N": "$input.params('id')" }
  }
}
EOF
  }
  credentials = aws_iam_role.api_gateway_dynamodb_read_role.arn
}

resource "aws_api_gateway_integration_response" "fetch_quiz_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.fetch_quiz_resource.id
  http_method = aws_api_gateway_method.fetch_quiz_method.http_method
  status_code = "200"
  depends_on  = [aws_api_gateway_integration.fetch_quiz_integration]

  response_templates = {
    "application/json" = <<EOF
#set($quizRoot = $input.path('$.Item'))
{
  "quiz_id": "$input.params('id')",
  "quiz_title": "$quizRoot.quiz_title.S",
  "questions": $quizRoot.questions.L
}
EOF
  }
}

resource "aws_api_gateway_method_response" "fetch_quiz_method_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.fetch_quiz_resource.id
  http_method = aws_api_gateway_method.fetch_quiz_method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_iam_role" "api_gateway_dynamodb_read_role" {
  name = "api_gateway_dynamodb_read_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "api_gateway_dynamodb_read_policy" {
  name = "api_gateway_dynamodb_read_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "dynamodb:GetItem",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "api_gateway_dynamodb_read_role_policy_attachment" {
  role       = aws_iam_role.api_gateway_dynamodb_read_role.name
  policy_arn = aws_iam_policy.api_gateway_dynamodb_read_policy.arn
}

resource "aws_api_gateway_deployment" "fetch_quiz_api_deployment" {
  depends_on  = [aws_api_gateway_integration.fetch_quiz_integration]
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = "prod"
}

output "fetch_quiz_api_endpoint" {
  value = aws_api_gateway_deployment.fetch_quiz_api_deployment.invoke_url
}
