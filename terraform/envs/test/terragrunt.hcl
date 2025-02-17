include {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/app"
}

inputs = {
  env             = "test"
  gcp_project     = "chatparser"
  bucket_location = "us-central1"
  force_destroy   = true
}
