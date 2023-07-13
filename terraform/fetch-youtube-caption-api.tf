resource "aws_api_gateway_resource" "fetch_youtube_caption_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "fetch-youtube-caption"
}

resource "aws_api_gateway_method" "fetch_youtube_caption_method" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.fetch_youtube_caption_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "fetch_youtube_caption_quiz_engine_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.fetch_youtube_caption_resource.id
  http_method             = aws_api_gateway_method.fetch_youtube_caption_method.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = data.aws_lambda_function.quiz_engine_lambda.invoke_arn
  credentials             = aws_iam_role.api_gateway_lambda_execution_role.arn

  request_templates = {
    "application/json" = <<EOF
{
  "fetchYoutubeCaption": {
      "url": "$input.params('url')"
  }
}
EOF
  }
}

resource "aws_api_gateway_method_response" "fetch_youtube_caption_method_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.fetch_youtube_caption_resource.id
  http_method = aws_api_gateway_method.fetch_youtube_caption_method.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "fetch_youtube_caption_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.fetch_youtube_caption_resource.id
  http_method = aws_api_gateway_method.fetch_youtube_caption_method.http_method
  status_code = aws_api_gateway_method_response.fetch_youtube_caption_method_response.status_code
  depends_on  = [aws_api_gateway_integration.fetch_youtube_caption_quiz_engine_integration]

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  response_templates = {
    "application/json" = <<EOF
#set($responseRoot = $input.path('$'))
{
  "transcript": "$responseRoot.body.transcript"
}
EOF
  }
}

resource "aws_api_gateway_deployment" "fetch_youtube_caption_api_deployment" {
  depends_on  = [aws_api_gateway_integration.fetch_youtube_caption_quiz_engine_integration]
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = "prod"
}

output "fetch_youtube_caption_api_endpoint" {
  value = aws_api_gateway_deployment.fetch_youtube_caption_api_deployment.invoke_url
}
