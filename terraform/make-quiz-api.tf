resource "aws_api_gateway_resource" "make_quiz_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "make-quiz"
}

resource "aws_api_gateway_method" "make_quiz_method" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.make_quiz_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "quiz_engine_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.make_quiz_resource.id
  http_method             = aws_api_gateway_method.make_quiz_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = data.aws_lambda_function.quiz_engine_lambda.invoke_arn
  credentials             = aws_iam_role.api_gateway_lambda_execution_role.arn
}

resource "aws_api_gateway_method_response" "make_quiz_method_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.make_quiz_resource.id
  http_method = aws_api_gateway_method.make_quiz_method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "make_quiz_integration_response" {
  rest_api_id       = aws_api_gateway_rest_api.rest_api.id
  resource_id       = aws_api_gateway_resource.make_quiz_resource.id
  http_method       = aws_api_gateway_method.make_quiz_method.http_method
  status_code       = aws_api_gateway_method_response.make_quiz_method_response.status_code
  selection_pattern = ".*"
}

resource "aws_api_gateway_method_settings" "make_quiz_method_settings" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = "prod"
  method_path = "${aws_api_gateway_resource.make_quiz_resource.path_part}/${aws_api_gateway_method.make_quiz_method.http_method}"

  settings {
    # Enable CloudWatch logging and metrics
    metrics_enabled    = true
    data_trace_enabled = true
    logging_level      = "INFO"
    # Limit the rate of calls to prevent abuse and unwanted charges
    throttling_rate_limit  = 100
    throttling_burst_limit = 50
  }
}

resource "aws_api_gateway_deployment" "make_quiz_api_deployment" {
  depends_on  = [aws_api_gateway_integration.quiz_engine_integration]
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = "prod"
}

output "make_quiz_api_endpoint" {
  value = aws_api_gateway_deployment.make_quiz_api_deployment.invoke_url
}
