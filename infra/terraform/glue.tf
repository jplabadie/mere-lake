resource "aws_glue_catalog_database" "mere" {
  name = "mere"
}

resource "aws_glue_catalog_table" "orders" {
  name          = "orders"
  database_name = aws_glue_catalog_database.mere.name
  table_type    = "EXTERNAL_TABLE"

  parameters = {
    classification           = "csv"
    "skip.header.line.count" = "1"
  }

  storage_descriptor {
    location      = "s3://${aws_s3_bucket.lake["raw"].bucket}/orders/"
    input_format  = "org.apache.hadoop.mapred.TextInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat"

    ser_de_info {
      serialization_library = "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe"
      parameters = {
        "field.delim"            = ","
        "skip.header.line.count" = "1"
      }
    }

    columns {
      name = "order_id"
      type = "bigint"
    }
    columns {
      name = "region"
      type = "string"
    }
    columns {
      name = "amount_cents"
      type = "bigint"
    }
    columns {
      name = "status"
      type = "string"
    }
    columns {
      name = "day"
      type = "string"
    }
  }
}
