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
    "prod",
  ])
  all_configs = toset(concat(tolist(local.envs), ["dev"]))
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

resource "google_artifact_registry_repository" "docker" {
  location      = "us-central1"
  repository_id = "docker"
  description   = "project docker repository"
  format        = "DOCKER"

  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 20
    }
  }

  labels = {
    managed = "terraform"
  }
}

resource "google_service_account" "cloudbuild_service_account" {
  for_each     = local.all_configs
  account_id   = "cloudbuild-sa-${each.value}"
  display_name = "cloudbuild-sa-${each.value}"
  description  = "Cloud build service account (${each.value})"
}

resource "google_service_account" "cloudrun_service_account" {
  for_each     = local.envs
  account_id   = "cloudrun-sa-${each.value}"
  display_name = "cloudrun-sa-${each.value}"
  description  = "Cloud Run service account (${each.value})"
}

resource "google_service_account_iam_binding" "cloudbuild_cloudrun_iam" {
  for_each           = local.envs
  service_account_id = google_service_account.cloudrun_service_account[each.value].name
  role               = "roles/iam.serviceAccountUser"

  members = [
    "serviceAccount:${google_service_account.cloudbuild_service_account[each.value].email}",
  ]
}

resource "google_project_iam_member" "cloudbuild_sa" {
  for_each = {
    for pair in setproduct(toset([
      "roles/logging.logWriter",
      "roles/artifactregistry.writer",
      "roles/run.developer"
      ]), local.all_configs) : "${pair[0]}-${pair[1]}" => {
      role = pair[0]
      env  = pair[1]
    }
  }

  role    = each.value.role
  project = var.gcp_project
  member  = "serviceAccount:${google_service_account.cloudbuild_service_account[each.value.env].email}"
}

resource "google_project_iam_member" "cloudrun_sa" {
  for_each = {
    for pair in setproduct(toset([
      "roles/secretmanager.secretAccessor"
      ]), local.envs) : "${pair[0]}-${pair[1]}" => {
      role = pair[0]
      env  = pair[1]
    }
  }

  role    = each.value.role
  project = var.gcp_project
  member  = "serviceAccount:${google_service_account.cloudrun_service_account[each.value.env].email}"
}
resource "google_cloudbuild_trigger" "cloudbuild-images" {
  name            = "cloudbuild-images"
  service_account = google_service_account.cloudbuild_service_account["dev"].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    push {
      branch = ".*"
    }
  }

  included_files = ["cloudbuild/cloudbuild-images.yaml"]
  filename       = "cloudbuild/cloudbuild-images.yaml"
}

resource "google_cloudbuild_trigger" "build" {
  name            = "build"
  service_account = google_service_account.cloudbuild_service_account["dev"].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    push {
      branch = ".*"
    }
  }

  filename = "cloudbuild/build.yaml"
}

resource "google_cloudbuild_trigger" "test" {
  name            = "test"
  service_account = google_service_account.cloudbuild_service_account["dev"].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    push {
      branch = ".*"
    }
  }

  filename = "cloudbuild/test.yaml"
}

resource "google_cloudbuild_trigger" "validate" {
  name            = "validate"
  service_account = google_service_account.cloudbuild_service_account["dev"].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    push {
      branch = ".*"
    }
  }

  filename = "cloudbuild/validate.yaml"
}

resource "google_cloudbuild_trigger" "security" {
  name            = "security"
  service_account = google_service_account.cloudbuild_service_account["dev"].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    push {
      branch = ".*"
    }
  }

  filename = "cloudbuild/security.yaml"
}

resource "google_cloudbuild_trigger" "deploy" {
  for_each        = local.envs
  name            = "deploy-${each.value}"
  service_account = google_service_account.cloudbuild_service_account[each.value].id
  location        = "us-central1"

  repository_event_config {
    repository = "projects/chatparser/locations/us-central1/connections/bnekolny/repositories/bnekolny-chatparser"

    #repository = google_cloudbuildv2_repository.my-repository.id
    push {
      branch = each.value == "prod" ? "^main$" : "^${each.value}$"
    }
  }

  substitutions = {
    _CLOUD_RUN_SERVICE_ACCOUNT = "${google_service_account.cloudrun_service_account[each.value].email}"
    _ENV                       = each.value
  }

  filename = "cloudbuild/deploy.yaml"
}
