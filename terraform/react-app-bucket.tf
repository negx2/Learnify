provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = jsondecode(file("${path.module}/../configs/aws_resources.json"))["s3_webiste_bucket_name"]

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website_bucket_access" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls   = false
  block_public_policy = false
  ignore_public_acls  = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "website_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website_bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    effect = "Allow"
  }
}

resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.website_bucket_policy.json
}

resource "aws_s3_bucket_cors_configuration" "website_bucket_cors" {
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  bucket = aws_s3_bucket.website_bucket.id
}

resource "aws_s3_bucket_versioning" "website_bucket_versioning" {
  bucket = aws_s3_bucket.website_bucket.id
    versioning_configuration {
    status = "Enabled" # or "Suspended" to disable versioning
  }
}

resource "aws_s3_bucket" "website_bucket_logs" {
  bucket = "website-logs-bucket"
}

resource "aws_s3_bucket_logging" "website_bucket_logging" {
  bucket = aws_s3_bucket.website_bucket.id

  target_bucket = aws_s3_bucket.website_bucket_logs.id
  target_prefix = "logs/"
}
