output "service_url" {
  value = google_cloud_run_v2_service.backend.uri
}

output "pubsub_topic_name" {
  value = google_pubsub_topic.agent_mesh.name
}