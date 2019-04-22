FROM node:10-alpine

WORKDIR /opt/frolfit-server
ADD . .
RUN npm i

ENTRYPOINT npm i && npm run start
