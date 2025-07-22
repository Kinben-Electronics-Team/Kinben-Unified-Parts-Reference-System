#!/usr/bin/env python3
"""
Simple HTTP server for local development testing
Serves the dist directory for testing Firebase deployment structure
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = "dist"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    # Change to repository root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    if not os.path.exists(DIRECTORY):
        print(f"Error: Directory '{DIRECTORY}' not found. Run 'npm run build' first.")
        sys.exit(1)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🌐 Server running at http://localhost:{PORT}")
        print(f"📁 Serving directory: {DIRECTORY}")
        print(f"🚀 App should be at: http://localhost:{PORT}/KPS/")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")