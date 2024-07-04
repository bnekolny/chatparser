variable "bucket_location" {
  description = "The location of the GCS bucket"
  type        = string
  default     = "us-central1"
}

variable "force_destroy" {
  description = "Allows the bucket to be deleted even if it contains objects"
  type        = bool
  default     = false
}

variable "env" {
  description = "environment for this"
  type        = string
}

variable "gcp_project" {
  description = "GCP project for things to run"
  type        = string
}

variable "IMPERSONATE_SERVICE_ACCOUNT" {
  description = "Service account to impersonate"
  type        = string
}
