# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .


RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine
WORKDIR /app
RUN npm install -g sirv-cli
COPY --from=build /app/dist ./dist

# Cloud Run dynamically assigns a PORT
ENV PORT=8080
EXPOSE 8080

# Serve static files with single-page-app routing enabled (--single)
CMD ["sh", "-c", "sirv dist --port $PORT --host 0.0.0.0 --single"]
