resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "pubsub.googleapis.com",
    "cloudfunctions.googleapis.com",
    "artifactregistry.googleapis.com"
  ])
  service = each.key
  disable_on_destroy = false
}

resource "google_pubsub_topic" "agent_mesh" {
  name = "agent-mesh-events"
  depends_on = [google_project_service.services]
}

resource "google_service_account" "backend_sa" {
  account_id   = "portfolio-backend-sa"
  display_name = "Service Account for Portfolio Backend"
}

resource "google_project_iam_member" "artifact_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.backend_sa.email}"
}

resource "google_project_iam_member" "cloud_run_developer" {
  project = var.project_id
  role    = "roles/run.developer"
  member  = "serviceAccount:${google_service_account.backend_sa.email}"
}

resource "google_project_iam_member" "iam_service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.backend_sa.email}"
}

resource "google_pubsub_topic_iam_member" "publisher_binding" {
  topic  = google_pubsub_topic.agent_mesh.name
  role   = "roles/pubsub.publisher"
  member = "serviceAccount:${google_service_account.backend_sa.email}"
}

resource "google_cloud_run_v2_service" "backend" {
  name     = var.service_name
  location = var.region

  template {
    service_account = google_service_account.backend_sa.email
    containers {
      image = "gcr.io/${var.project_id}/${var.service_name}:latest"
      
      env {
        name  = "PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "PUBSUB_TOPIC"
        value = google_pubsub_topic.agent_mesh.name
      }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_access" {
  name     = google_cloud_run_v2_service.backend.name
  location = google_cloud_run_v2_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}