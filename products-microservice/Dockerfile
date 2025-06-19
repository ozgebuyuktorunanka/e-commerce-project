FROM node:20-alpine

WORKDIR /ecommercemicroservices/products-microservice

COPY products-microservice/package*.json ./

RUN npm install

COPY . . 

RUN npm run build

CMD ["npm", "run", "start:dev"]
