# ARCHITECTURE.md — Offline Local Model Switchboard CLI

## System summary

A command-line tool that starts a self-hosted gateway on a laptop or on-premises server, registers locally running model endpoints behind one OpenAI-compatible address, and switches routing profiles between a small local model for drafting and a larger local model for review without changing client configuration, while logging all usage locally so token counts and costs stay visible even when no cloud provider is reachable.

The system is decomposed into 5 modules, listed below exactly as recorded in `PROJECT-SPEC.yaml`. This file quotes the spec; it does not re-decide it. If anything here conflicts with `PROJECT-SPEC.yaml`, the spec wins and the conflict is a stop-and-ask event.

## Design principles

- One spec of record: module boundaries, interfaces, and scope live in `PROJECT-SPEC.yaml` and are quoted, never re-derived.
- Every module has a single responsibility and communicates through the data flow below; no module reaches into another module's internals.
- Validation happens at the boundary where untrusted data enters, not after it has spread.
- Nothing is presented as working until a test exercising the behavior under test passes.

## Module map

| Module | Responsibility | Key libraries |
|---|---|---|
| GatewayServer | Serves the OpenAI-compatible HTTP API on the configured local address, validates incoming requests, and returns streamed or non-streamed responses from the selected endpoint. | net/http, encoding/json |
| EndpointRegistry | Stores registered local endpoints, probes their health every 30 seconds, and reports which endpoints are healthy and available for routing. | net/http, time |
| ProfileRouter | Holds named routing profiles, selects the endpoint for each request from the active profile, and switches the active profile on command without restarting the gateway. | encoding/json, sync |
| UsageStore | Writes one usage row per completed request to the local SQLite database and answers token-total queries grouped by model and day. | database/sql, modernc.org/sqlite |
| ConfigLoader | Loads configuration from the config file, environment variables, and CLI flags in documented precedence order and validates listen address, endpoints, and profiles before startup. | viper, cobra |

## Data flow

1. ConfigLoader validates the config file and hands the listen address, endpoints, and profiles to GatewayServer, ProfileRouter, and EndpointRegistry
2. GatewayServer receives an OpenAI-compatible request and asks ProfileRouter for the endpoint matching the active profile
3. ProfileRouter checks EndpointRegistry for a healthy endpoint and returns its base URL and model identifier to GatewayServer
4. GatewayServer forwards the request to the local endpoint, streams the response back to the client, and sends the token counts and elapsed time to UsageStore
5. UsageStore writes one row per completed request to the local SQLite database for later status and totals queries

## Interfaces

Cross-module contracts are defined by the reference document in this package (see the folder tree in `README.md`) and by the handoff notes at the end of each phase file. A phase may not change an interface defined by an earlier phase without stopping to ask.

## Explicit non-goals

- Hosting or running model inference itself; the tool only fronts endpoints that already run locally
- Proxying to cloud model providers or performing cloud billing and metering
- Providing a graphical user interface or web dashboard
- Fine-tuning, training, or evaluating models
- Multi-user authentication, single sign-on, or team access control

These match the scope boundary rule in `AGENTS.md` word for word in intent: crossing them requires human review first.

## Source

Derived from the idea "Offline Local Model Switchboard CLI" (source repo: QuantumNous/new-api). Aligned feature carried into the design: Lane: offline local AI — the CLI runs the gateway entirely self-hosted and keeps routing and usage tracking local, so local tools keep working and stay auditable when offline.
