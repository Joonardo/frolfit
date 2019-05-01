FROM node:lts-alpine

WORKDIR /opt/frolfit-client

COPY package*.json ./

RUN npm install

ENTRYPOINT npm i && npm run serve
