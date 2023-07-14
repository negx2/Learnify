resource "aws_s3_bucket" "models_bucket" {
  bucket = "learnify-models-bucket"
}

resource "aws_s3_bucket_public_access_block" "models_bucket_access" {
  bucket = aws_s3_bucket.models_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_versioning" "models_bucket_versioning" {
  bucket = aws_s3_bucket.models_bucket.id
  versioning_configuration {
    status = "Enabled" # or "Suspended" to disable versioning
  }
}

resource "aws_s3_bucket" "models_bucket_logs" {
  bucket = "models-bucket-logs"
}

resource "aws_s3_bucket_logging" "models_bucket_logging" {
  bucket = aws_s3_bucket.models_bucket.id

  target_bucket = aws_s3_bucket.models_bucket_logs.id
  target_prefix = "logs/"
}


