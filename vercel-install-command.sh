#!/bin/bash

# Clear npm cache first
echo "Clearing npm cache..."
npm cache clean --force

# Install with force flag to bypass peer dependency issues
echo "Installing dependencies with force flag..."
npm install --force

# Print installed versions for debugging
echo "Installed versions:"
npm list react react-dom next @react-three/drei @react-three/fiber react-leaflet three 