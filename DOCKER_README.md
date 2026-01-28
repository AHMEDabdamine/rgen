# Docker Setup for Research Generator

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and run the application
docker-compose up --build

# Or in detached mode
docker-compose up --build -d
```

### Using Docker directly

```bash
# Build the image
docker build -t research-generator .

# Run the container
docker run -p 3000:3000 research-generator
```

## Access the Application

Once running, open your browser and navigate to:

- **Local**: http://localhost:3000
- **Network**: http://your-server-ip:3000

## Docker Features

- **Multi-stage build**: Optimized image size
- **Non-root user**: Enhanced security
- **Health checks**: Automatic monitoring
- **Production ready**: Built and optimized for production

## Environment Variables

The app will work out-of-the-box, but you can optionally set:

- `NODE_ENV=production` (already set in docker-compose)

## Stopping the Application

```bash
# Stop docker-compose
docker-compose down

# Stop individual container
docker stop <container-id>
```

## Development vs Production

- **Development**: Use `npm run dev` locally
- **Production**: Use Docker for deployment

## Troubleshooting

If the port 3000 is already in use, you can change it:

```bash
docker-compose up --build -d
# Then edit docker-compose.yml to use a different port
```

## Image Size

The final Docker image is typically ~50MB due to:

- Alpine Linux base
- Multi-stage build
- Production dependencies only
