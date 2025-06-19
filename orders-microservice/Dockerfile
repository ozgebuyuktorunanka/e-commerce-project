FROM node:20-alpine

WORKDIR /ecommercemicroservices/orders-microservice

COPY orders-microservice/package*.json ./

RUN npm install

COPY . . 

RUN npm run build

CMD ["npm", "run", "start:dev"]
