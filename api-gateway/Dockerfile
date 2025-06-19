FROM node:20-alpine

WORKDIR /ecommercemicroservices/api-gateway

COPY api-gateway/package*.json ./

RUN npm install

# Source code
COPY . . 
RUN npm run build

CMD ["npm", "run", "start:dev"]
