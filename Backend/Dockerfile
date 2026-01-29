FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=optional || npm install --omit=optional

COPY . .
ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/index.js"]
