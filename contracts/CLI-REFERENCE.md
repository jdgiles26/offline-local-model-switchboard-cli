# CLI REFERENCE — Offline Local Model Switchboard CLI

This reference documents every command of the Offline Local Model Switchboard CLI, its flags, its exit codes, and how configuration sources override each other. The binary is named switchboard and every command is run as switchboard followed by a subcommand.

## Command tree

switchboard serve starts the gateway and blocks until stopped with Ctrl-C. switchboard endpoint add registers an endpoint, switchboard endpoint list shows registered endpoints with health, and switchboard endpoint remove deletes one by name. switchboard profile list shows profiles, switchboard profile use NAME switches the active profile, and switchboard profile show prints the active profile. switchboard usage today prints token totals for the current day, switchboard usage --days 7 prints totals for the last 7 days, and switchboard status prints gateway state, active profile, endpoint health, and the last 24 hours of token totals.

## Flags per command

serve accepts --listen (default 127.0.0.1:8080), --config (path to the config file), and --profile (profile to activate at startup). endpoint add requires --name, --url, and --model, and accepts --timeout-seconds (default 30). profile use takes exactly one positional argument, the profile name, and no flags. usage accepts --days (default 1, range 1 to 90) and --model to filter totals to one model. status accepts no flags. Every command accepts --help, which prints its usage and exits 0.

## Exit codes

Exit code 0 means the command completed as requested. Exit code 1 means a general error such as a missing config file, an invalid flag value, or a failed database write, and the error is printed to standard error. Exit code 2 means a usage error such as a missing required flag or an unknown subcommand. Exit code 3 means the gateway could not start because the listen address is already in use or a configured endpoint URL is invalid. Exit code 4 means a requested profile or endpoint name does not exist.

## Config file precedence

Values are resolved in this order from highest to lowest precedence: CLI flags, environment variables prefixed with SWITCHBOARD_, the config file, then built-in defaults. The config file is found in this order: the path given by --config, then ./switchboard.yaml in the working directory, then $HOME/.config/switchboard/switchboard.yaml. Environment variables use uppercase names with the SWITCHBOARD_ prefix, for example SWITCHBOARD_LISTEN overrides the listen address. A value set in a higher-precedence source replaces the same value from every lower source, and values from different sources are merged by key rather than replacing the whole file.

This document is part of the spec of record: it derives from `PROJECT-SPEC.yaml` and the phase files quote it. Changing a contract recorded here is a stop-and-ask event.
