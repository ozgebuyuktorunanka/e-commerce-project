FROM node:20-alpine

WORKDIR /ecommercemicroservices/users-microservice

COPY users-microservice/package*.json ./

RUN npm install

COPY . . 

RUN npm run build

CMD ["npm", "run", "start:dev"]
