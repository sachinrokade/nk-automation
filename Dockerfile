FROM node:18-alpine

WORKDIR /app

# Install system dependencies for Puppeteer
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Install pdfinfo for PDF parsing
RUN apk add --no-cache poppler-utils

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p logs resumes

EXPOSE 4200

CMD ["npm", "start"]
