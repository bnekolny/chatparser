include {
  path = find_in_parent_folders()
}

inputs = {
  gcp_project    = "chatparser"
  bucket_name    = "chatparser-data-prod"
  force_destroy  = true
}

remote_state {
  backend = "gcs"
  config = {
    bucket = "chatparser-terraform"
    prefix = "terraform/state"
  }
}

