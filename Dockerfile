FROM node:22

WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm ci

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci

# Copy the application
COPY . .

# Build the React application
RUN npm run build

# Fly will provide PORT
EXPOSE 8080

CMD ["npx", "tsx", "server/server.ts"]