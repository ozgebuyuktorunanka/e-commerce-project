FROM node:20-alpine

WORKDIR /ecommercemicroservices/shipping-microservice

COPY shipping-microservice/package*.json ./

RUN npm install

COPY . . 

RUN npm run build

CMD ["npm", "run", "start:dev"]
