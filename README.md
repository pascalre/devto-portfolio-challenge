# 🤖 Pascal's AI Agent Mesh – Portfolio Backend
This repository contains the high-performance Go-based backend for my interactive portfolio. It demonstrates a modern Event-Driven Architecture (EDA) integrating Google Gemini for intelligence and Google Pub/Sub for asynchronous event processing, fully containerized and running serverless on Google Cloud Run.

## 🌐 Live Demo

The backend is deployed and publicly accessible at: **[https://portfolio-backend-964537274400.europe-west3.run.app](https://portfolio-backend-964537274400.europe-west3.run.app)**

*Note: As this is a serverless deployment on Google Cloud Run, the first request might experience a slight "cold start" delay if the service has scaled to zero.*

## 🏗 Architecture Overview
The project serves as a practical showcase for bridging synchronous user interaction with asynchronous system extensibility.
* **Frontend**: Interactive Chat UI + Live Event Terminal.
* **Backend**: Built with Go's standard library (net/http) for a lean, high-performance service hosted on Google Cloud Run.
* **Orchestration**: Google Pub/Sub handles the asynchronous fan-out of system events.
* **Intelligence**: Google Gemini 2.0 Flash for context-aware career insights and agentic behavior.

#### The "Agent Mesh" Concept
Unlike traditional request-response chatbots, this "Agent Mesh" demonstrates how a single user interaction can trigger a cascade of parallel, decoupled tasks (e.g., logging, analytics, and secondary processing) without increasing user-facing latency.

## 🧠 New Year, New You: AI-Native Development
This project was developed for the [New Year, New You Portfolio Challenge](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31). A core pillar of the development was the Human-AI Collaboration with Google Gemini:
* **Senior DevOps & SRE Partner**: Gemini acted as a technical partner to resolve complex platform hurdles, such as fine-tuning multi-platform Docker builds (linux/amd64 for GCP) and architecting secure IAM-based communication between Cloud Run and Pub/Sub.
* **Idiomatic Go Engineering**: Gemini supported the implementation of idiomatic Go patterns, helping to keep the codebase clean and dependency-free by leveraging the power of the standard library.

## 🚀 Technical Highlights
* **Lean Standard Library Approach**: Intentionally built with net/http to minimize binary size and attack surface, ensuring rapid "cold starts" in serverless environments.
* **Hybrid Communication**: Immediate synchronous response for UX, while operational logs and background tasks are dispatched via Pub/Sub.
* **Production-Grade DevOps**: Features multi-stage Docker builds, "Scale-to-Zero" configuration for cost-efficiency, and secure Secret Management.