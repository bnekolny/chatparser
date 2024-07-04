terraform {
  backend "gcs" {}
}

provider "google" {
  project = var.gcp_project
  region  = "us-central1"

  impersonate_service_account = var.IMPERSONATE_SERVICE_ACCOUNT
}

locals {}

resource "google_storage_bucket" "appdata" {
  name          = "chatparser-appdata-${var.env}"
  location      = var.bucket_location
  force_destroy = var.force_destroy

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = false
  }

  autoclass {
    enabled                = true
    terminal_storage_class = "ARCHIVE"
  }

  labels = {
    managed = "terraform"
  }
}
