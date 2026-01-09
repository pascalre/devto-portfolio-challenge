variable "project_id" {
  default     = "dev-portfolio-challenge"
  description = "Deine Google Cloud Projekt ID"
  type        = string
}

variable "region" {
  description = "GCP Region für die Ressourcen"
  type        = string
  default     = "europe-west3"
}

variable "service_name" {
  default = "portfolio-backend"
}