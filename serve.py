#!/usr/bin/env python3
"""
Simple HTTP Server for KPN System Testing
=========================================

This lightweight Python server is designed specifically for testing the
Kinben Parts Reference System in CI/CD environments. It serves static files
and provides the necessary HTTP server functionality for automated tests.

Usage:
    python serve.py [port]

Default port: 8000
"""

import http.server
import socketserver
import sys
import os
from pathlib import Path

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP Request Handler with minimal logging for CI/CD environments."""
    
    def log_message(self, format, *args):
        """Override to reduce log verbosity during testing."""
        pass

def start_server(port=8000):
    """Start the HTTP server for testing purposes."""
    
    # Ensure we're serving from the correct directory
    web_dir = Path(__file__).parent
    os.chdir(web_dir)
    
    try:
        with socketserver.TCPServer(("", port), QuietHTTPRequestHandler) as httpd:
            print(f"🌐 KPN System Test Server running on http://localhost:{port}")
            print(f"📁 Serving files from: {web_dir}")
            print("🔄 Press Ctrl+C to stop the server")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n⏹️  Server stopped by user")
        
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Port {port} is already in use. Try a different port.")
            sys.exit(1)
        else:
            print(f"❌ Failed to start server: {e}")
            sys.exit(1)

if __name__ == "__main__":
    # Parse command line arguments
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid port number. Using default port 8000.")
            port = 8000
    
    # Validate port range
    if not (1 <= port <= 65535):
        print("❌ Port must be between 1 and 65535. Using default port 8000.")
        port = 8000
    
    start_server(port)