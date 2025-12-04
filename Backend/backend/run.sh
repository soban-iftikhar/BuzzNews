#!/bin/bash
# Run FastAPI development server

# Initialize database
python init_db.py

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
