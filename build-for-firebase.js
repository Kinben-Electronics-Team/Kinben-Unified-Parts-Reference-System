#!/usr/bin/env node
/**
 * Build script for Firebase deployment
 * Prepares files for root-level hosting (simplified from KPS subdirectory)
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Building for Firebase deployment (root-level)...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    console.log('📁 Created dist directory');
}

// Files to copy
const filesToCopy = [
    'index.html',
    { src: 'KPN_System_Workbook.html', dest: 'KPN_System_Workbook.html' }  // Copy local auth version as main app
];

// Get build timestamp for version tracking
const buildTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
console.log(`🕒 Build timestamp: ${buildTimestamp}`);

// Copy main files to root of dist
filesToCopy.forEach(file => {
    let srcPath, destPath, filename;
    
    if (typeof file === 'string') {
        srcPath = path.join(__dirname, file);
        destPath = path.join(distDir, file);
        filename = file;
    } else {
        srcPath = path.join(__dirname, file.src);
        destPath = path.join(distDir, file.dest);
        filename = file.dest;
    }
    
    if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // For local auth version, no Firebase-specific processing needed
        if (filename === 'KPN_System_Workbook.html') {
            // Local authentication version - no changes needed
        }
        
        // Remove KPS/ prefixes from paths since we're now at root level
        if (content.includes('KPS/')) {
            content = content.replace(/href="KPS\//g, 'href="');
            content = content.replace(/src="KPS\//g, 'src="');
            content = content.replace(/url\(KPS\//g, 'url(');
        }
        
        // Add build timestamp as HTML comment for debugging
        content = content.replace(
            '<head>',
            `<head>
    <!-- Build: ${buildTimestamp} -->
    <!-- Local Authentication: v3.1.0 -->`
        );
        
        fs.writeFileSync(destPath, content);
        console.log(`✅ Processed ${filename} (Firebase version, timestamp: ${buildTimestamp})`);
    }
});

// Local auth version is self-contained - no separate JS files needed

// Copy directories that contain assets
const dirsToCopy = [
    'KPN Master Reference Sheet',
    'Kinben Basic Kicad Library',
    'Project Templates'
];

dirsToCopy.forEach(dir => {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(distDir, dir);
    
    if (fs.existsSync(srcDir)) {
        copyRecursiveSync(srcDir, destDir);
        console.log(`📁 Copied ${dir}/`);
    }
});

console.log('🎉 Build completed! Ready for Firebase deployment.');
console.log('📁 Files prepared in: ./dist/');
console.log('🌐 Will be accessible at root level: https://the-clever-studio-f3b16.web.app/');

// Helper function to copy directories recursively
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}