terraform {
  required_version = ">= 1.9.0, < 2.0.0"

  # Local state is the starter. Before a second person applies, uncomment
  # this and point it at a bucket and lock table you already created.
  # backend "s3" {
  #   bucket         = "mere-tfstate"
  #   key            = "mere/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "mere-tfstate-lock"
  #   encrypt        = true
  # }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.70"
    }
  }
}

provider "aws" {
  region = var.region
}
