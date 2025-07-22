#!/usr/bin/env node
/**
 * Live Claude Code Token Usage Monitor
 * Shows progress bars of token usage across all sessions.
 * Run: node token-monitor.js
 */

const fs = require('fs');
const path = require('path');

// Configuration - adjust these based on your Claude plan
const CONFIG = {
    DAILY_LIMIT: 200000,     // Daily token limit
    MONTHLY_LIMIT: 5000000,  // Monthly token limit
    UPDATE_INTERVAL: 2000,   // Update every 2 seconds
    PROGRESS_BAR_WIDTH: 50   // Character width of progress bars
};

let sessionStart = Date.now();
let sessionTokens = 0;

function clearScreen() {
    console.clear();
}

function drawProgressBar(current, total, width = CONFIG.PROGRESS_BAR_WIDTH) {
    if (total === 0) return `[${'░'.repeat(width)}] 0.0% (0/${total.toLocaleString()} tokens)`;
    
    const progress = Math.min(current / total, 1.0);
    const filled = Math.floor(width * progress);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const percentage = (progress * 100).toFixed(1);
    
    return `[${bar}] ${percentage}% (${current.toLocaleString()}/${total.toLocaleString()} tokens)`;
}

function formatTimeElapsed(startTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function getStatusMessage(dailyTokens, monthlyTokens) {
    if (dailyTokens >= CONFIG.DAILY_LIMIT) return '🚨 DAILY LIMIT REACHED';
    if (monthlyTokens >= CONFIG.MONTHLY_LIMIT) return '🚨 MONTHLY LIMIT REACHED';
    if (dailyTokens >= CONFIG.DAILY_LIMIT * 0.9) return '⚠️  Approaching daily limit (90%)';
    if (dailyTokens >= CONFIG.DAILY_LIMIT * 0.8) return '⚠️  Approaching daily limit (80%)';
    if (monthlyTokens >= CONFIG.MONTHLY_LIMIT * 0.9) return '⚠️  Approaching monthly limit (90%)';
    if (monthlyTokens >= CONFIG.MONTHLY_LIMIT * 0.8) return '⚠️  Approaching monthly limit (80%)';
    return '✅ Usage within limits';
}

function parseRealTelemetryData() {
    // Parse real telemetry data from environment or temp files
    // Claude Code with console exporter will output to stderr/stdout
    // This function will be enhanced to read actual metrics
    
    // For now, try to read from potential telemetry output locations
    const telemetryPaths = [
        process.env.TEMP + '\\claude-code-telemetry.json',
        process.env.APPDATA + '\\claude-code\\telemetry.json',
        '.\\telemetry-output.txt'
    ];
    
    // Check if any telemetry files exist
    for (const filePath of telemetryPaths) {
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                const metrics = JSON.parse(data);
                if (metrics.tokenUsage) {
                    sessionTokens = metrics.tokenUsage.session || sessionTokens;
                    return metrics;
                }
            }
        } catch (error) {
            // Continue to next path or fallback
        }
    }
    
    // Fallback: simulate minimal usage for demo
    sessionTokens += 10;
    return null;
}

function displayMonitor() {
    clearScreen();
    
    // Get real telemetry data
    const telemetryData = parseRealTelemetryData();
    
    // Calculate usage (in real implementation, get these from telemetry data)
    const dailyTokens = sessionTokens; // In reality: sum from all today's sessions
    const monthlyTokens = sessionTokens; // In reality: sum from all month's sessions
    
    const now = new Date();
    const timeStr = now.toLocaleString();
    
    // Header
    console.log('🤖 Claude Code Token Usage Monitor');
    console.log('=' .repeat(60));
    console.log(`⏰ Session Time: ${formatTimeElapsed(sessionStart)}`);
    console.log(`📅 ${timeStr}`);
    console.log();
    
    // Session Usage
    console.log('📊 Current Session:');
    console.log(`   Tokens Used: ${sessionTokens.toLocaleString()}`);
    console.log(`   Rate: ${Math.floor(sessionTokens / ((Date.now() - sessionStart) / 60000)).toLocaleString()} tokens/min`);
    console.log();
    
    // Daily Usage
    console.log('📈 Daily Usage:');
    console.log(`   ${drawProgressBar(dailyTokens, CONFIG.DAILY_LIMIT)}`);
    console.log(`   Remaining: ${Math.max(0, CONFIG.DAILY_LIMIT - dailyTokens).toLocaleString()} tokens`);
    console.log();
    
    // Monthly Usage
    console.log('📅 Monthly Usage:');
    console.log(`   ${drawProgressBar(monthlyTokens, CONFIG.MONTHLY_LIMIT)}`);
    console.log(`   Remaining: ${Math.max(0, CONFIG.MONTHLY_LIMIT - monthlyTokens).toLocaleString()} tokens`);
    console.log();
    
    // Status
    console.log('🔍 Status:');
    console.log(`   ${getStatusMessage(dailyTokens, monthlyTokens)}`);
    console.log();
    
    // Instructions
    console.log('💡 Instructions:');
    console.log('   • This is currently showing simulated data');
    console.log('   • Enable Claude Code telemetry: export CLAUDE_CODE_ENABLE_TELEMETRY=1');
    console.log('   • Configure OTLP exporter to feed real data into this monitor');
    console.log('   • Press Ctrl+C to exit');
}

function main() {
    console.log('Starting Claude Code Token Usage Monitor...');
    console.log('Press Ctrl+C to exit\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        clearScreen();
        console.log('\n🛑 Token monitoring stopped.');
        console.log(`📊 Session Summary:`);
        console.log(`   Duration: ${formatTimeElapsed(sessionStart)}`);
        console.log(`   Tokens Used: ${sessionTokens.toLocaleString()}`);
        process.exit(0);
    });
    
    // Start monitoring loop
    displayMonitor();
    setInterval(displayMonitor, CONFIG.UPDATE_INTERVAL);
}

// Run the monitor
if (require.main === module) {
    main();
}

module.exports = { drawProgressBar, formatTimeElapsed, getStatusMessage };