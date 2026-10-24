variable "region" {
  type        = string
  description = "AWS region. The founding manifest defaults this to us-east-1."
  default     = "us-east-1"
}

variable "project" {
  type        = string
  description = "Name prefix for buckets and the analyst role."
  default     = "mere"
}
