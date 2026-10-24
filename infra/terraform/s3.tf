data "aws_caller_identity" "current" {}

locals {
  layers = toset(["raw", "curated", "results"])
}

resource "aws_s3_bucket" "lake" {
  for_each = local.layers
  bucket   = "${var.project}-${data.aws_caller_identity.current.account_id}-${each.key}"
}

resource "aws_s3_bucket_public_access_block" "lake" {
  for_each                = aws_s3_bucket.lake
  bucket                  = each.value.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "lake" {
  for_each = aws_s3_bucket.lake
  bucket   = each.value.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "curated" {
  bucket = aws_s3_bucket.lake["curated"].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "results" {
  bucket = aws_s3_bucket.lake["results"].id

  rule {
    id     = "expire-query-results"
    status = "Enabled"

    filter {
      prefix = ""
    }

    expiration {
      days = 14
    }
  }
}

resource "aws_s3_object" "orders" {
  bucket = aws_s3_bucket.lake["raw"].id
  key    = "orders/orders.csv"
  source = "${path.module}/../../sample/orders.csv"
  etag   = filemd5("${path.module}/../../sample/orders.csv")
}
