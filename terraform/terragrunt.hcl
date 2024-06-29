locals {
  project_id = "chatparser"
  region     = "us-central1"
}

remote_state {
  backend = "gcs"
  config = {
    bucket = "chatparser-terraform"
    prefix = "terraform/state"
    impersonate_service_account = get_env("TF_VAR_IMPERSONATE_SERVICE_ACCOUNT")
  }
}

terraform {
  source = "../../modules/chatparser"
}
