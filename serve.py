#!/usr/bin/env python3
"""
Simple HTTP server for local development of KPN System Workbook
Serves the current directory with proper MIME types for all file types.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with proper MIME types and CORS headers"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        """Guess the type of a file with better HTML support"""
        result = super().guess_type(path)
        
        # Handle the case where guess_type might return different formats
        if isinstance(result, tuple) and len(result) >= 2:
            mime_type, encoding = result[0], result[1]
        else:
            mime_type = result if isinstance(result, str) else 'text/plain'
            encoding = None
        
        # Ensure HTML files are properly served
        if path.endswith('.html'):
            return 'text/html', encoding
        elif path.endswith('.css'):
            return 'text/css', encoding
        elif path.endswith('.js'):
            return 'application/javascript', encoding
        elif path.endswith('.json'):
            return 'application/json', encoding
        
        return mime_type, encoding

def main():
    """Start the development server"""
    PORT = 8080
    
    # Check if files exist
    if not Path('index.html').exists():
        print("❌ Error: index.html not found in current directory")
        print("   Make sure you're running this from the project root directory")
        sys.exit(1)
    
    if not Path('KPN_System_Workbook.html').exists():
        print("❌ Error: KPN_System_Workbook.html not found")
        print("   Make sure all project files are present")
        sys.exit(1)
    
    print(f"🚀 Starting KPN System Workbook Development Server...")
    print(f"📂 Serving directory: {os.getcwd()}")
    print(f"🌐 Server running at: http://localhost:{PORT}")
    print(f"📱 Landing page: http://localhost:{PORT}")
    print(f"🔧 Direct app: http://localhost:{PORT}/KPN_System_Workbook.html")
    print()
    print("Features available:")
    print("  ✅ Multi-level system hierarchy")
    print("  ✅ PCB management (2L-8L, Flex, Rigid-Flex)")
    print("  ✅ Image upload and preview")
    print("  ✅ Real-time search and filtering")
    print("  ✅ CSV/JSON export functionality")
    print("  ✅ Complete demo data included")
    print()
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    # Start server
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("🌐 Browser opened automatically")
            except:
                print("🌐 Please open http://localhost:{PORT} in your browser")
            
            print(f"✅ Server started successfully on port {PORT}")
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Port already in use
            print(f"❌ Error: Port {PORT} is already in use")
            print("   Try a different port or stop the existing server")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
