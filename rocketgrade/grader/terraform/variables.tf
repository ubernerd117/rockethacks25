variable "region" {
  description = "AWS region to deploy resources"
  default     = "us-west-2"
}

variable "google_api_key" {
  description = "Your Google API key"
  type        = string
}

 variable "aws_account_id" {
   description = "Your AWS account ID"
   type        = string
 }