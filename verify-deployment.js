#!/usr/bin/env node

/**
 * Pre-Deployment Verification Script
 * Run this before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Weight Tracker - Pre-Deployment Verification\n');
console.log('='.repeat(50));

let hasErrors = false;
let warnings = 0;

// Check 1: Backend .env.example exists
console.log('\n✓ Checking backend configuration...');
if (fs.existsSync(path.join(__dirname, 'backend', '.env.example'))) {
  console.log('  ✅ backend/.env.example exists');
} else {
  console.log('  ❌ backend/.env.example missing');
  hasErrors = true;
}

// Check 2: Frontend .env.example exists
console.log('\n✓ Checking frontend configuration...');
if (fs.existsSync(path.join(__dirname, 'frontend', '.env.example'))) {
  console.log('  ✅ frontend/.env.example exists');
} else {
  console.log('  ❌ frontend/.env.example missing');
  hasErrors = true;
}

// Check 3: Deployment files exist
console.log('\n✓ Checking deployment files...');
const deployFiles = ['vercel.json', 'render.yaml', 'DEPLOY_NOW.md'];
deployFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`  ✅ ${file} exists`);
  } else {
    console.log(`  ❌ ${file} missing`);
    hasErrors = true;
  }
});

// Check 4: .gitignore exists and includes .env
console.log('\n✓ Checking .gitignore...');
const backendGitignore = path.join(__dirname, 'backend', '.gitignore');
if (fs.existsSync(backendGitignore)) {
  const content = fs.readFileSync(backendGitignore, 'utf8');
  if (content.includes('.env')) {
    console.log('  ✅ backend/.gitignore includes .env');
  } else {
    console.log('  ⚠️  backend/.gitignore should include .env');
    warnings++;
  }
} else {
  console.log('  ❌ backend/.gitignore missing');
  hasErrors = true;
}

// Check 5: Package.json scripts
console.log('\n✓ Checking package.json scripts...');
const backendPkg = require('./backend/package.json');
if (backendPkg.scripts.start && backendPkg.scripts.seed) {
  console.log('  ✅ Backend scripts configured (start, seed)');
} else {
  console.log('  ❌ Backend scripts missing');
  hasErrors = true;
}

const frontendPkg = require('./frontend/package.json');
if (frontendPkg.scripts.build && frontendPkg.scripts.dev) {
  console.log('  ✅ Frontend scripts configured (build, dev)');
} else {
  console.log('  ❌ Frontend scripts missing');
  hasErrors = true;
}

// Check 6: Server.js has health endpoint
console.log('\n✓ Checking API health endpoint...');
const serverFile = path.join(__dirname, 'backend', 'server.js');
if (fs.existsSync(serverFile)) {
  const content = fs.readFileSync(serverFile, 'utf8');
  if (content.includes('/api/health')) {
    console.log('  ✅ Health check endpoint exists');
  } else {
    console.log('  ⚠️  No health check endpoint found');
    warnings++;
  }
}

// Check 7: CORS configuration
console.log('\n✓ Checking CORS configuration...');
if (fs.existsSync(serverFile)) {
  const content = fs.readFileSync(serverFile, 'utf8');
  if (content.includes('cors')) {
    console.log('  ✅ CORS is configured');
    if (content.includes('localhost:5173')) {
      console.log('  ℹ️  Remember to add your production URL to CORS');
    }
  } else {
    console.log('  ⚠️  CORS might not be configured');
    warnings++;
  }
}

// Check 8: API client uses environment variable
console.log('\n✓ Checking API client configuration...');
const apiClient = path.join(__dirname, 'frontend', 'src', 'api', 'client.js');
if (fs.existsSync(apiClient)) {
  const content = fs.readFileSync(apiClient, 'utf8');
  if (content.includes('import.meta.env.VITE_API_URL')) {
    console.log('  ✅ API client uses environment variable');
  } else {
    console.log('  ❌ API client should use VITE_API_URL');
    hasErrors = true;
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Verification Summary:\n');

if (hasErrors) {
  console.log('❌ FAILED - Please fix the errors above before deploying\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log(`⚠️  PASSED with ${warnings} warning(s) - Review warnings before deploying\n`);
} else {
  console.log('✅ ALL CHECKS PASSED - Ready for deployment!\n');
  console.log('Next steps:');
  console.log('1. Read DEPLOY_NOW.md for deployment instructions');
  console.log('2. Set up MongoDB Atlas');
  console.log('3. Deploy to Render (backend)');
  console.log('4. Deploy to Vercel (frontend)');
  console.log('5. Update CORS with your production URL\n');
}

console.log('='.repeat(50) + '\n');
