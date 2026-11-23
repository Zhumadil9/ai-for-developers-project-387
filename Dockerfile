FROM node:24.22.1-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY contract/package.json contract/package.json
RUN npm ci

COPY . .
RUN npm run contract
RUN npm run sdk
RUN npm run build -w backend
RUN npm run build -w frontend

FROM node:24.22.1-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY contract/package.json contract/package.json
RUN npm ci --omit=dev

COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/frontend/dist ./frontend/dist

EXPOSE 3001

CMD ["node", "backend/dist/src/index.js"]
