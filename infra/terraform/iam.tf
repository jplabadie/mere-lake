resource "aws_iam_role" "analyst" {
  name = "mere-analyst"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "analyst" {
  name = "mere-analyst"
  role = aws_iam_role.analyst.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ReadLake"
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:ListBucket"]
        Resource = flatten([
          for bucket in aws_s3_bucket.lake : [bucket.arn, "${bucket.arn}/*"]
        ])
      },
      {
        Sid      = "WriteResults"
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject", "s3:AbortMultipartUpload"]
        Resource = "${aws_s3_bucket.lake["results"].arn}/athena/*"
      },
      {
        Sid    = "Query"
        Effect = "Allow"
        Action = [
          "athena:StartQueryExecution",
          "athena:GetQueryExecution",
          "athena:GetQueryResults",
          "athena:StopQueryExecution",
        ]
        Resource = aws_athena_workgroup.mere.arn
      },
      {
        Sid    = "Catalog"
        Effect = "Allow"
        Action = ["glue:GetDatabase", "glue:GetTable", "glue:GetPartitions"]
        Resource = [
          "arn:aws:glue:${var.region}:${data.aws_caller_identity.current.account_id}:catalog",
          "arn:aws:glue:${var.region}:${data.aws_caller_identity.current.account_id}:database/mere",
          "arn:aws:glue:${var.region}:${data.aws_caller_identity.current.account_id}:table/mere/*",
        ]
      },
    ]
  })
}
