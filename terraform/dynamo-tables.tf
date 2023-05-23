resource "aws_dynamodb_table" "quizzes" {
  name         = "quizzes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "quiz_id"

  point_in_time_recovery {
    enabled = true
  }

  deletion_protection_enabled = true

  attribute {
    name = "quiz_id"
    type = "N"
  }

}
