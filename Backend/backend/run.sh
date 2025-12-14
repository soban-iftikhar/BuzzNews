#!/bin/bash
# Concise setup and run script for the FastAPI backend.

VENV_DIR="venv"

# --- 1. SETUP PHASE ---

# Create Venv if it doesn't exist. The '||' stops the script if venv creation fails.
python3 -m venv "$VENV_DIR" || { echo "ERROR: Failed to create virtual environment."; exit 1; }

# Activate Venv
echo "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Install dependencies only if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    echo "WARNING: requirements.txt not found. Skipping pip install."
fi

# --- 2. DATABASE INITIALIZATION ---
echo "Running database initialization..."
python init_db.py || { echo "ERROR: init_db.py failed. Check your DB connection."; exit 1; }

# --- 3. START SERVER ---
echo "Starting FastAPI development server on http://0.0.0.0:8000"
uvicorn main:app --reload --host 0.0.0.0 --port 8000