FROM node:lts-alpine

WORKDIR /opt/frolfit-client

COPY package*.json ./

RUN npm install

EXPOSE 8080

ENTRYPOINT npm i && npm run serve

# CMD [ "npm", "run", "serve" ]
