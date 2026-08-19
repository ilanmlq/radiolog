FROM node:20-alpine

WORKDIR /app

COPY backend/ ./

RUN npm ci --include=dev

EXPOSE 3000

CMD [ "npm", "run", "dev" ]