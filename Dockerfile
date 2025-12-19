# ---------- Build frontend ----------
FROM node:20-alpine AS frontend
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ---------- Run backend ----------
FROM node:20-alpine
WORKDIR /app

# install backend deps
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

# copy backend code
COPY backend/ /app/backend/

# copy frontend build into /app/frontend/dist (where server.js expects it)
COPY --from=frontend /frontend/dist /app/frontend/dist

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
