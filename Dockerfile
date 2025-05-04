# Build stage
FROM node:18 as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Expose web port
EXPOSE 80
