locals {
  project_id = "chatparser"
  region     = "us-central1"
  env_from_dir = basename(get_terragrunt_dir())
}

remote_state {
  backend = "gcs"
  config = {
    bucket = "chatparser-terraform"
    prefix = "terraform/state/${local.env_from_dir}"
    impersonate_service_account = get_env("TF_VAR_IMPERSONATE_SERVICE_ACCOUNT")
  }
}
