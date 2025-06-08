#!/bin/bash

# Urban AI Deployment Script

echo "🚀 Starting Urban AI Deployment..."

# 1. Pull latest changes if connected to a remote repository
if git remote -v | grep origin > /dev/null; then
  echo "📥 Pulling latest changes from remote repository..."
  git pull origin main || git pull origin master
else
  echo "⚠️ No remote repository found. Continuing with local changes."
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Build the application
echo "🏗️ Building the application..."
npm run build

# 4. Create version tag
VERSION=$(date +"%Y.%m.%d-%H%M")
echo "🏷️ Creating version tag: v$VERSION"
git add .
git commit -m "Deploy version $VERSION"
git tag -a "v$VERSION" -m "Version $VERSION"

# 5. Push changes if connected to a remote repository
if git remote -v | grep origin > /dev/null; then
  echo "📤 Pushing changes and tags to remote repository..."
  git push origin main || git push origin master
  git push origin --tags
fi

# 6. Deploy (example for Vercel, adjust as needed)
echo "🚀 Deploying to production..."
npx vercel --prod

echo "✅ Deployment completed! Version: v$VERSION" 