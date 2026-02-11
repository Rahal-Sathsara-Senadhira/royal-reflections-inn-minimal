FROM node:20-alpine

WORKDIR /app

# Copy only manifests first (enables Docker layer cache)
COPY package*.json ./

# Make npm more stable on weak/slow networks (EC2 free tier)
# Also avoid audit/fund to reduce extra network calls.
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-timeout 600000 \
 && npm config set fund false \
 && npm config set audit false \
 && npm ci --prefer-offline --no-audit --no-fund \
    || npm install --prefer-offline --no-audit --no-fund

# Now copy the rest
COPY . .

EXPOSE 5173
CMD ["npm","run","dev","--","--host","--strictPort","--port","5173"]
