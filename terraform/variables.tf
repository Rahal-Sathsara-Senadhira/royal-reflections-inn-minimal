variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "eu-north-1"
}

variable "project_name" {
  type        = string
  description = "Tag name for project"
  default     = "Royal Reflection Inn"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.small"
}

variable "key_name" {
  type        = string
  description = "EXISTING AWS EC2 key pair name (the one you created in console)"
}

variable "allowed_ssh_cidrs" {
  type        = list(string)
  description = "CIDRs allowed to SSH. Use your IP /32 for security."
  default     = ["0.0.0.0/0"]
}
