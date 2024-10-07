#!/bin/bash

SOURCE_DIR="../teaching-website"
DEST_DIR="./"

# Function to run rsync
run_rsync() {
    rsync -av --delete \
        --exclude='runClone.sh' \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='scripts' \
        --exclude='build' \
        --exclude='.docusaurus' \
        --exclude='.env' \
        "$SOURCE_DIR/" "$DEST_DIR"
}

# Function to start Docusaurus dev server
start_docusaurus() {
    SITE=gbsl PORT=3001 yarn run start &
    DOCUSAURUS_PID=$!
}

# Function to cleanup and exit
cleanup_and_exit() {
    echo "Stopping Docusaurus dev server and sync watch..."
    kill $DOCUSAURUS_PID
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup_and_exit INT

# Start Docusaurus dev server
start_docusaurus

# Initial sync
run_rsync

# Monitor for changes and sync
fswatch -o "$SOURCE_DIR" | while read f; do
    echo "Change detected in $f"
    run_rsync
done
