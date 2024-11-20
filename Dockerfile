FROM node:20-alpine

RUN npm install -g pnpm

# Set the working directory
WORKDIR /sonic-cast/

# Root Directory
COPY package.json ./
COPY pnpm-lock.yaml ./

# workspace and turbo config file
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Web application
COPY apps/web/package.json ./apps/web/
# Web Server application
COPY apps/wss/package.json ./apps/wss/

# Dependency server
COPY packages/types/package.json ./packages/types/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN pnpm install

COPY . .

RUN pnpm run build

# Web -> port 3000, WSS -> 8080
EXPOSE 3000 8080

CMD ["pnpm", "run", "start"]