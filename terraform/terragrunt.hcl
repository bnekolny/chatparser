locals {
  project_id = "chatparser"
  region     = "us-central1"
}

terraform {
  source = "../../modules/chatparser"
}
