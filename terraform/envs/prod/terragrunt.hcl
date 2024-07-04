include {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/app"
}

inputs = {
  env            = "prod"
  gcp_project    = "chatparser"
  force_destroy  = false
}
