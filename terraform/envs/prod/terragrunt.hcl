include {
  path = find_in_parent_folders()
}

inputs = {
  env            = "prod"
  gcp_project    = "chatparser"
  force_destroy  = false
}
