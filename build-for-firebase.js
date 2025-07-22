#!/usr/bin/env node
/**
 * Build script for Firebase deployment
 * Prepares files for theclever.studio/KPS subdirectory hosting
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Building for Firebase deployment...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    console.log('📁 Created dist directory');
}

// Create KPS subdirectory
const kpsDir = path.join(distDir, 'KPS');
if (!fs.existsSync(kpsDir)) {
    fs.mkdirSync(kpsDir, { recursive: true });
    console.log('📁 Created KPS subdirectory');
}

// Files to copy
const filesToCopy = [
    'index.html',
    'KPN_System_Workbook.html',
    'KPN_System_Workbook_backup.html'
];

// Get build timestamp for version tracking
const buildTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
console.log(`🕒 Build timestamp: ${buildTimestamp}`);

// Copy main files
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(kpsDir, file);
    
    if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // Update paths for subdirectory deployment
        if (file === 'index.html') {
            // Root index.html - keep KPS/ paths
            content = content.replace(/href="KPS\//g, 'href="');
            content = content.replace(/src="KPS\//g, 'src="');
        } else {
            // Files going into KPS folder - remove KPS/ prefix from relative links
            content = content.replace(/href="KPS\//g, 'href="');
            content = content.replace(/src="KPS\//g, 'src="');
            content = content.replace(/url\(KPS\//g, 'url(');
        }
        
        // Add build timestamp as HTML comment for debugging
        content = content.replace(
            '<head>',
            `<head>
    <!-- Build: ${buildTimestamp} -->
    <!-- Launch Button Fix: v2.1.1 -->`
        );
        
        fs.writeFileSync(destPath, content);
        console.log(`✅ Processed ${file} (timestamp: ${buildTimestamp})`);
    }
});

// Copy directories that contain assets
const dirsToCopy = [
    'KPN Master Reference Sheet',
    'Kinben Basic Kicad Library',
    'Project Templates'
];

dirsToCopy.forEach(dir => {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(kpsDir, dir);
    
    if (fs.existsSync(srcDir)) {
        copyRecursiveSync(srcDir, destDir);
        console.log(`📁 Copied ${dir}/`);
    }
});

// Create root index.html that redirects to /KPS
const rootIndexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting to Kinben Parts System...</title>
    <meta http-equiv="refresh" content="0; url=/KPS/">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { 
            background: rgba(255,255,255,0.1); 
            padding: 30px; 
            border-radius: 10px; 
            max-width: 400px; 
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Kinben Parts System</h1>
        <p>Redirecting to KPS...</p>
        <p><a href="/KPS/" style="color: #fff; text-decoration: underline;">Click here if not redirected automatically</a></p>
    </div>
    <script>
        window.location.href = '/KPS/';
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), rootIndexContent);
console.log('✅ Created root redirect page');

console.log('🎉 Build completed! Ready for Firebase deployment.');
console.log('📁 Files prepared in: ./dist/');
console.log('🌐 Will be accessible at: theclever.studio/KPS');

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