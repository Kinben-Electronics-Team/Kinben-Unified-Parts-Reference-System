#!/usr/bin/env python3
"""
Auto-sync file watcher for Kinben Parts Reference System
Watches for file changes and automatically syncs to Raspberry Pi
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class SyncHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_sync = 0
        self.sync_delay = 2  # Wait 2 seconds after last change before syncing
        
    def on_modified(self, event):
        if event.is_directory:
            return
        
        # Filter for relevant files
        relevant_extensions = {'.html', '.css', '.js', '.json', '.py', '.csv', '.md'}
        file_path = Path(event.src_path)
        
        if file_path.suffix.lower() in relevant_extensions:
            print(f"📝 File changed: {file_path.name}")
            self.schedule_sync()
    
    def on_created(self, event):
        if not event.is_directory:
            file_path = Path(event.src_path)
            print(f"✨ New file: {file_path.name}")
            self.schedule_sync()
    
    def schedule_sync(self):
        self.last_sync = time.time()
        # Schedule sync after delay
        threading.Timer(self.sync_delay, self.sync_if_ready).start()
    
    def sync_if_ready(self):
        if time.time() - self.last_sync >= self.sync_delay:
            self.sync_to_rpi()
    
    def sync_to_rpi(self):
        print("\n🔄 Syncing changes to Raspberry Pi...")
        try:
            # Run the deployment script
            result = subprocess.run(['deploy-to-rpi.bat'], 
                                  capture_output=True, text=True, shell=True)
            
            if result.returncode == 0:
                print("✅ Sync completed successfully!")
            else:
                print(f"❌ Sync failed: {result.stderr}")
        except Exception as e:
            print(f"❌ Sync error: {e}")
        print("-" * 50)

def main():
    import threading
    
    project_dir = Path(__file__).parent
    
    print("🚀 Kinben Parts Reference System - Auto Sync")
    print("=" * 50)
    print(f"📂 Watching: {project_dir}")
    print("📡 Target: Raspberry Pi (192.168.1.25:3000)")
    print("⏱️  Sync delay: 2 seconds after changes")
    print("\nPress Ctrl+C to stop watching...")
    print("-" * 50)
    
    event_handler = SyncHandler()
    observer = Observer()
    observer.schedule(event_handler, str(project_dir), recursive=True)
    
    try:
        observer.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping file watcher...")
        observer.stop()
    
    observer.join()
    print("👋 Auto-sync stopped")

if __name__ == "__main__":
    try:
        import watchdog
    except ImportError:
        print("Installing watchdog for file watching...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'watchdog'], 
                      check=True)
        import watchdog
    
    main()