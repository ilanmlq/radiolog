FROM node:20-alpine

WORKDIR /app

COPY frontend/ ./

ENV CI=true
RUN [ "npm", "ci" ]

EXPOSE 3001

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3001" ]

