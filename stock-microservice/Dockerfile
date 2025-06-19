FROM node:20-alpine

WORKDIR /usr/src/app/stock-microservices

COPY ./stock-microservice/package*.json ./

RUN npm install

COPY . . 

RUN npm run build 

CMD ["npm", "run", "start:dev"]