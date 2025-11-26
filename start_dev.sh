#!/bin/bash

echo "Starting all development environments..."

# Get the absolute path of the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

open_tab() {
    gnome-terminal --tab --title="$1" --working-directory="$2" -- bash -c "$3; exec bash"
}
# Open visual studio
open_tab "code" "$SCRIPT_DIR" "cd ../ && code GRC360; exit"

# Backend
open_tab "Backend1" "$SCRIPT_DIR/BackEnd" "npm run dev"

open_tab "Backend2" "$SCRIPT_DIR/BackEnd" "echo backend"

# Frontend
open_tab "Frontend1" "$SCRIPT_DIR/FrontEnd" "npm run dev"
open_tab "Frontend2" "$SCRIPT_DIR/FrontEnd"  "echo frontend"

# Open postman
open_tab "postman" "$SCRIPT_DIR" "postman; exit"

# Open google
open_tab "google" "$SCRIPT_DIR" "google-chrome"

echo "All development environments started!"
