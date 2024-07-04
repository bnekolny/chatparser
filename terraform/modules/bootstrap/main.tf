terraform {
  backend "gcs" {}
}

provider "google" {
  project = var.gcp_project
  region  = "us-central1"

  impersonate_service_account = var.IMPERSONATE_SERVICE_ACCOUNT
}

locals {
  # this could be a var
  envs = toset([
    "test",
    #"prod",
  ])
}

resource "google_project_service" "services" {
  # can't share this resource with test and prod configs, so just run in test
  for_each = toset([
    # this needs to be manually enabled?
    # https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview
    #"cloudresourcemanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
  ])
  project = var.gcp_project
  service = each.key
}
# instead of doing this in tf, let's just go here and click the button. will be a better management of the token
# https://console.cloud.google.com/cloud-build/connections/create?authuser=0&project=chatparser
# resource "google_cloudbuildv2_connection" "bnekolny" {
# data "google_cloudbuildv2_connection" "bnekolny" {

resource "google_service_account" "cloudbuild_service_account" {
  for_each     = toset(concat(tolist(local.envs), ["dev"]))
  account_id   = "cloudbuild-sa-${each.value}"
  display_name = "cloudbuild-sa-${each.value}"
  description  = "Cloud build service account (${each.value})"
}

resource "google_cloudbuild_trigger" "build" {
  service_account = google_service_account.cloudbuild_service_account["dev"].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    push {
      branch = ".*"
    }
  }

  filename = "build.yaml"
}

resource "google_cloudbuild_trigger" "deploy" {
  for_each        = local.envs
  service_account = google_service_account.cloudbuild_service_account[each.value].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    #repository = google_cloudbuildv2_repository.my-repository.id
    push {
      branch = "^${each.value}$"
    }
  }

  filename = "deploy.yaml"
}
