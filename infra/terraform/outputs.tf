output "raw_bucket" {
  value = aws_s3_bucket.lake["raw"].bucket
}

output "curated_bucket" {
  value = aws_s3_bucket.lake["curated"].bucket
}

output "results_bucket" {
  value = aws_s3_bucket.lake["results"].bucket
}

output "workgroup" {
  value = aws_athena_workgroup.mere.name
}

output "analyst_role_arn" {
  value = aws_iam_role.analyst.arn
}
