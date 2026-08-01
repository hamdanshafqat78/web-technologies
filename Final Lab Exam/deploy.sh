#!/bin/bash

# Exit on any error
set -e

echo "=========================================================="
echo " Starting RoyalTag E-Commerce Deployment on Ubuntu"
echo "=========================================================="

# 1. Update package list & install prerequisites
echo "[1/6] Updating package repository and installing unzip..."
sudo apt-get update
sudo apt-get install -y unzip curl gnupg

# 2. Install Node.js (v20) if not installed
if ! command -v node &> /dev/null; then
    echo "[2/6] Node.js not found. Installing Node.js v20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "[2/6] Node.js is already installed ($(node -v))"
fi

# 3. Install MongoDB if not installed
if ! command -v mongod &> /dev/null; then
    echo "[3/6] MongoDB not found. Installing MongoDB..."
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg --yes
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl daemon-reload
    sudo systemctl enable mongod
    sudo systemctl start mongod
else
    echo "[3/6] MongoDB is already installed"
    sudo systemctl start mongod || true
fi

# 4. Install Node dependencies
echo "[4/6] Installing project dependencies..."
npm install

# 5. Seed the database
echo "[5/6] Seeding the database..."
npm run seed

# 6. Setup PM2 to run the application
if ! command -v pm2 &> /dev/null; then
    echo "[6/6] Installing PM2 globally..."
    sudo npm install -g pm2
else
    echo "[6/6] PM2 is already installed"
fi

echo "Starting the application under PM2..."
pm2 restart server || pm2 start server.js --name server
pm2 save

echo "=========================================================="
echo " Deployment completed successfully!"
echo " The application is running on port 3000."
echo " Verify locally using: curl -I http://localhost:3000"
echo "=========================================================="
