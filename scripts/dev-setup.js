#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 School Events Hub - Development Setup');
console.log('=====================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPrerequisites() {
  log('\n📋 Checking Prerequisites...', 'blue');
  
  const checks = [
    { name: 'Node.js', command: 'node --version', required: 'v16.0.0' },
    { name: 'npm', command: 'npm --version', required: 'v8.0.0' },
    { name: 'PostgreSQL', command: 'psql --version', required: 'v12.0.0' }
  ];

  let allGood = true;

  checks.forEach(check => {
    try {
      const version = execSync(check.command, { encoding: 'utf8' }).trim();
      log(`✅ ${check.name}: ${version}`, 'green');
    } catch (error) {
      log(`❌ ${check.name}: Not found or not accessible`, 'red');
      log(`   Required: ${check.required}`, 'yellow');
      allGood = false;
    }
  });

  return allGood;
}

function setupEnvironment() {
  log('\n🔧 Setting up Environment...', 'blue');
  
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ Created .env file from .env.example', 'green');
    } else {
      log('❌ .env.example not found', 'red');
      return false;
    }
  } else {
    log('✅ .env file already exists', 'green');
  }

  return true;
}

function installDependencies() {
  log('\n📦 Installing Dependencies...', 'blue');
  
  try {
    // Install root dependencies
    log('Installing root dependencies...', 'yellow');
    execSync('npm install', { stdio: 'inherit' });
    
    // Install server dependencies
    log('Installing server dependencies...', 'yellow');
    execSync('cd server && npm install', { stdio: 'inherit' });
    
    // Install client dependencies
    log('Installing client dependencies...', 'yellow');
    execSync('cd client && npm install', { stdio: 'inherit' });
    
    log('✅ All dependencies installed successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to install dependencies', 'red');
    return false;
  }
}

function setupDatabase() {
  log('\n🗄️  Setting up Database...', 'blue');
  
  try {
    // Check if PostgreSQL is running
    execSync('pg_isready', { stdio: 'pipe' });
    log('✅ PostgreSQL is running', 'green');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'school_events_hub';
    try {
      execSync(`createdb ${dbName}`, { stdio: 'pipe' });
      log(`✅ Database '${dbName}' created`, 'green');
    } catch (error) {
      log(`ℹ️  Database '${dbName}' already exists`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log('❌ Database setup failed', 'red');
    log('   Make sure PostgreSQL is running and accessible', 'yellow');
    return false;
  }
}

function runMigrations() {
  log('\n🔄 Running Database Migrations...', 'blue');
  
  try {
    execSync('cd server && npm run migrate', { stdio: 'inherit' });
    log('✅ Database migrations completed', 'green');
    return true;
  } catch (error) {
    log('❌ Database migrations failed', 'red');
    return false;
  }
}

function seedDatabase() {
  log('\n🌱 Seeding Database...', 'blue');
  
  try {
    execSync('cd server && npm run seed', { stdio: 'inherit' });
    log('✅ Database seeded successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Database seeding failed', 'red');
    return false;
  }
}

function buildFrontend() {
  log('\n🏗️  Building Frontend...', 'blue');
  
  try {
    execSync('cd client && npm run build', { stdio: 'inherit' });
    log('✅ Frontend built successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Frontend build failed', 'red');
    return false;
  }
}

function startDevelopment() {
  log('\n🎯 Starting Development Environment...', 'blue');
  
  try {
    // Start both server and client in development mode
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    log('❌ Failed to start development environment', 'red');
  }
}

function showNextSteps() {
  log('\n📋 Next Steps:', 'blue');
  log('1. Start the development server: npm run dev', 'yellow');
  log('2. Open http://localhost:3000 in your browser', 'yellow');
  log('3. API will be available at http://localhost:5000/api', 'yellow');
  log('4. Check the README.md for development guidelines', 'yellow');
  
  log('\n🔗 Useful Commands:', 'blue');
  log('• npm run dev          - Start development servers', 'yellow');
  log('• npm run server       - Start backend only', 'yellow');
  log('• npm run client       - Start frontend only', 'yellow');
  log('• npm run test         - Run tests', 'yellow');
  log('• npm run lint         - Run linting', 'yellow');
  log('• npm run build        - Build for production', 'yellow');
}

function main() {
  const steps = [
    { name: 'Prerequisites', fn: checkPrerequisites },
    { name: 'Environment', fn: setupEnvironment },
    { name: 'Dependencies', fn: installDependencies },
    { name: 'Database', fn: setupDatabase },
    { name: 'Migrations', fn: runMigrations },
    { name: 'Seeding', fn: seedDatabase },
    { name: 'Frontend Build', fn: buildFrontend }
  ];

  let allStepsPassed = true;

  steps.forEach((step, index) => {
    log(`\n[${index + 1}/${steps.length}] ${step.name}`, 'blue');
    const success = step.fn();
    if (!success) {
      allStepsPassed = false;
      log(`\n❌ Setup failed at step: ${step.name}`, 'red');
      process.exit(1);
    }
  });

  if (allStepsPassed) {
    log('\n🎉 Setup completed successfully!', 'green');
    showNextSteps();
  }
}

// Run the setup
main();