resource "aws_api_gateway_resource" "fetch_featured_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "fetch-featured"
}

resource "aws_api_gateway_method" "fetch_featured_method" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.fetch_featured_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "fetch_featured_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.fetch_featured_resource.id
  http_method             = aws_api_gateway_method.fetch_featured_method.http_method
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:us-east-2:dynamodb:action/GetItem"
  request_templates = {
    "application/json" = <<EOF
{
  "TableName": "quizzes",
  "ScanIndexForward": true,
  "Limit":10
}
EOF
  }
  credentials = aws_iam_role.api_gateway_dynamodb_read_role.arn
}

resource "aws_api_gateway_integration_response" "fetch_featured_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.fetch_featured_resource.id
  http_method = aws_api_gateway_method.fetch_featured_method.http_method
  status_code = "200"
  depends_on  = [aws_api_gateway_integration.fetch_featured_integration]

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  response_templates = {
    "application/json" = <<EOF
#set($inputRoot = $input.path('$'))
{
  "quizzes": [
    #foreach($item in $inputRoot.Items)
    {
      "quiz_id": "$item.quiz_id.N",
      "quiz_title": "$item.quiz_title.S"
    }#if($foreach.hasNext),#end
    #end
  ]
}
EOF
  }
}

resource "aws_api_gateway_method_response" "fetch_featured_method_response" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.fetch_featured_resource.id
  http_method = aws_api_gateway_method.fetch_featured_method.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = false
  }
  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_deployment" "fetch_featured_api_deployment" {
  depends_on  = [aws_api_gateway_integration.fetch_featured_integration]
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = "prod"
}

output "fetch_featured_api_endpoint" {
  value = aws_api_gateway_deployment.fetch_featured_api_deployment.invoke_url
}
