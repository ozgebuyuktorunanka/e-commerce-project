FROM node:20-alpine

WORKDIR /ecommerce-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]

#docker compose --env-file .env.development up --build