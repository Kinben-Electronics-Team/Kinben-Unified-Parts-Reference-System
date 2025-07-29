#!/usr/bin/env node

/**
 * Secret Detection Script for Kinben Parts System
 * Scans for potential secrets and credentials before commits
 */

const fs = require('fs');
const path = require('path');

// Secret patterns to detect
const SECRET_PATTERNS = [
  {
    name: 'Firebase API Key',
    pattern: /AIza[0-9A-Za-z-_]{35}/g,
    description: 'Firebase API keys should be in environment variables'
  },
  {
    name: 'Generic API Key',
    pattern: /[Aa][Pp][Ii][_]?[Kk][Ee][Yy].*[=:]\s*['\"][0-9a-zA-Z]{32,}['\"]/g,
    description: 'API keys should not be hardcoded'
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN PRIVATE KEY-----/g,
    description: 'Private keys should never be committed'
  },
  {
    name: 'Service Account JSON',
    pattern: /"type":\s*"service_account"/g,
    description: 'Service account files should not be committed'
  },
  {
    name: 'Password in Code',
    pattern: /[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd].*[=:]\s*['\"][^'\"]+['\"]/g,
    description: 'Passwords should not be hardcoded'
  }
];

// Files to ignore
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /\.env$/,               // Environment file (expected to have secrets)
  /\.env\.example/,
  /check-secrets\.js$/,  // This file itself
  /SECURITY_SETUP\.md$/,  // Documentation
  /README\.md$/,          // Documentation
  /AUTHENTICATION\.md$/,   // Documentation
  /package-lock\.json$/,   // NPM lockfile
  /\.md$/                 // All markdown files
];

// Placeholder values that are safe
const SAFE_PLACEHOLDERS = [
  'your-api-key-here',
  'your-firebase-api-key-here',
  'your-actual-api-key',
  'AIzaSyAbc123...',
  'example-key',
  'placeholder',
  'admin123',             // Demo password in docs
  'password',             // Generic word
  'Password',             // Label text
  '@inquirer/password'    // NPM package name
];

function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

function isSafePlaceholder(match) {
  return SAFE_PLACEHOLDERS.some(placeholder => 
    match.toLowerCase().includes(placeholder.toLowerCase())
  );
}

function scanFile(filePath) {
  if (shouldIgnoreFile(filePath)) {
    return [];
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    // Skip files that can't be read
    return [];
  }

  const violations = [];

  SECRET_PATTERNS.forEach(({ name, pattern, description }) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // Skip if it's a safe placeholder
      if (isSafePlaceholder(match[0])) {
        continue;
      }

      const lines = content.substring(0, match.index).split('\n');
      const lineNumber = lines.length;
      const lineContent = lines[lines.length - 1] + match[0];

      violations.push({
        file: filePath,
        line: lineNumber,
        type: name,
        description,
        content: lineContent.trim(),
        match: match[0]
      });
    }
  });

  return violations;
}

function scanDirectory(dir) {
  let allViolations = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldIgnoreFile(fullPath)) {
          allViolations = allViolations.concat(scanDirectory(fullPath));
        }
      } else if (entry.isFile()) {
        const violations = scanFile(fullPath);
        allViolations = allViolations.concat(violations);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }

  return allViolations;
}

function main() {
  console.log('🔍 Scanning for secrets and credentials...');
  
  const rootDir = process.cwd();
  const violations = scanDirectory(rootDir);

  if (violations.length === 0) {
    console.log('✅ No secrets detected in repository');
    console.log('🛡️ Secret scanning completed successfully');
    process.exit(0);
  }

  console.log(`❌ Found ${violations.length} potential secret(s):`);
  console.log('');

  violations.forEach((violation, index) => {
    console.log(`${index + 1}. ${violation.type} in ${violation.file}:${violation.line}`);
    console.log(`   Description: ${violation.description}`);
    console.log(`   Content: ${violation.content}`);
    console.log('');
  });

  console.log('🚨 COMMIT BLOCKED: Secrets detected in repository');
  console.log('');
  console.log('📋 To fix:');
  console.log('1. Move secrets to .env file (already in .gitignore)');
  console.log('2. Use environment variables in your code');
  console.log('3. Review SECURITY_SETUP.md for proper configuration');
  console.log('');
  console.log('💡 For help: https://github.com/Kinben-Electronics-Team/Kinben-Unified-Parts-Reference-System/blob/main/SECURITY_SETUP.md');

  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { scanDirectory, scanFile, SECRET_PATTERNS };