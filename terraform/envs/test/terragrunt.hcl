include {
  path = find_in_parent_folders()
}

inputs = {
  env             = "test"
  gcp_project     = "chatparser"
  bucket_location = "us-central1"
  force_destroy   = true
}
