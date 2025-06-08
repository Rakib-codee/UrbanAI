# Urban AI Project

A comprehensive urban planning and visualization dashboard with AI-powered analytics for smart cities.

## Features

- Interactive dashboard for urban data visualization
- AI-powered analytics and predictions
- Traffic analysis and simulation
- Resource management tools
- Weather insights and forecasting
- Environmental impact assessment

## Deployment Guide

### Prerequisites

- Node.js 18.x or higher
- Git
- npm or yarn

### Local Development

1. Clone the repository
```bash
git clone <your-repo-url>
cd urbanai-project
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

#### Option 1: Using the deployment script

We've included a deployment script that handles versioning and deployment:

```bash
./deploy.sh
```

This script will:
- Pull the latest changes from your repository
- Install dependencies
- Build the application
- Create a version tag using the current date and time
- Push changes and tags to your repository
- Deploy to Vercel (can be modified for other platforms)

#### Option 2: Manual deployment

1. Build the application
```bash
npm run build
```

2. Deploy the output
```bash
# For Vercel
npx vercel --prod

# For Netlify
npx netlify deploy --prod

# For serving locally
npm run start
```

### Version Control

We use Git for version control with the following conventions:

- **Tags**: Each deployment creates a tag with format `vYYYY.MM.DD-HHMM`
- **Commits**: Use descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- **Branches**: 
  - `main` - Production-ready code
  - `develop` - Integration branch for features
  - `feature/name` - For new features
  - `fix/name` - For bug fixes

## Environment Variables

Create a `.env.local` file for development:

```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
```

## Contributing

1. Create a feature branch from develop
2. Make your changes
3. Submit a pull request to develop
4. After review, changes will be merged to main for deployment

## License

This project is licensed under the MIT License - see the LICENSE file for details.
