# This file exists to account for all the clickops necessary for the terraform to run
# Each of these needs to exist, which is being enforced via data resource lookups

# https://console.cloud.google.com/security/secret-manager/
data "google_secret_manager_secret" "GEMINI_API_KEY" {
  secret_id = "GEMINI_API_KEY"
  project = var.gcp_project
}
