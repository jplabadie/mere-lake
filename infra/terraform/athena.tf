resource "aws_athena_workgroup" "mere" {
  name = "mere"

  configuration {
    enforce_workgroup_configuration    = true
    publish_cloudwatch_metrics_enabled = true

    result_configuration {
      output_location = "s3://${aws_s3_bucket.lake["results"].bucket}/athena/"

      encryption_configuration {
        encryption_option = "SSE_S3"
      }
    }
  }
}
