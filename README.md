# MyBookshelf Frontend

This is the React-based frontend for the MyBookshelf application. It provides a single-page interface for users to log in and manage their personal book collection.

## Prerequisites

- Node.js (v14+)
- npm
- Docker & Docker Compose (optional)

## Installation

```bash
git clone https://github.com/MauroDeceuninck/mybookshelf-frontend.git
cd mybookshelf-frontend
npm install
```

## Configuration

Create a `public/runtime-config-dev/config.json` file for development that points to the backend API:

```json
{
  "API_URL": "http://localhost:3000",
}
```

> In production (Docker), this file is mounted into the container at `/usr/share/nginx/html/runtime-config/config.json`.

Create a `.env` file in the root:

```env
PORT=3001
```

## Running Locally

Make sure the backend is running on port `3000`, then:

```bash
npm start
```

Access the frontend at: [http://localhost:3001](http://localhost:3001)

## Docker Deployment

### Build and run the image:

```bash
# Build the frontend image
docker build -t mybookshelf-frontend ./mybookshelf-frontend

# Run the frontend container with volume mount for config.json
docker run -d \
  --name mybookshelf-frontend \
  -p 3001:80 \
  -v $(pwd)/frontend-config/config.json:/usr/share/nginx/html/runtime-config/config.json \
  mybookshelf-frontend
```

### Or use Docker Compose:

```yaml
version: "3"

services:
  backend:
    build:
        context: ./mybookshelf-backend
    # image: maurodeceuninck/mybookshelf-backend:latest
    ports:
      - "3000:3000"
    environment:
      MONGODB_URI: "mongodb+srv://<username>:<password>@cluster.mongodb.net/mybookshelf?retryWrites=true&w=majority&appName=Cluster0"
      JWT_SECRET: "your-secret-key"

  frontend:
    build:
        context: ./mybookshelf-frontend
    # image: maurodeceuninck/mybookshelf-frontend:latest
    ports:
      - "3001:80"
    volumes:
      - ./frontend-config/config.json:/usr/share/nginx/html/runtime-config/config.json

    depends_on:
      - backend
```

or use the publicly available images: 

```bash
maurodeceuninck/mybookshelf-frontend:latest
maurodeceuninck/mybookshelf-backend:latest
```

Make sure to create the `config.json` file (adjust the URL if needed):

```json
{
  "API_URL": "http://localhost:3000"
}
```

Or my domain if the publicly available images are used:

```json
{
  "API_URL": "https://mybookshelf.mauroserver.com"
}
```

Then start with:

```bash
docker compose up --build
```