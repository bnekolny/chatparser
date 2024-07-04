variable "gcp_project" {
  description = "GCP project for things to run"
  type        = string
}

variable "IMPERSONATE_SERVICE_ACCOUNT" {
  description = "Service account to impersonate"
  type        = string
}
