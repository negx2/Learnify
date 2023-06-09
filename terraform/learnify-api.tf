resource "aws_api_gateway_rest_api" "rest_api" {
  name        = "LearnifyAPI"
  description = "Learnify API"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_account" "learnify_account" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

resource "aws_iam_role" "cloudwatch" {
  name = "api_gateway_cloudwatch_global"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
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
      "Action": ["dynamodb:GetItem", "dynamodb:Scan"],
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



resource "aws_iam_role_policy" "cloudwatch" {
  name = "default"
  role = aws_iam_role.cloudwatch.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

/*
resource "aws_api_gateway_stage" "prod_stage" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  deployment_id = aws_api_gateway_deployment.rest_api_deployment.id
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.LearnifyApiLogGroup.arn
    format          = "$context.requestId $context.identity.sourceIp $context.identity.userAgent $context.httpMethod $context.resourcePath $context.protocol $context.status $context.responseLength $context.integrationLatency"
  }
}

*/

resource "aws_cloudwatch_log_group" "LearnifyApiLogGroup" {
  name = "/aws/api-gateway/LearnifyAPI"
}

