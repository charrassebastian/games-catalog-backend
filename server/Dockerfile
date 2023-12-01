FROM node:lts-hydrogen
WORKDIR /app
ADD package*.json ./
RUN npm install
ADD index.js ./
ADD controllers ./controllers
ADD models ./models
ADD routes.js ./
CMD ["node", "index.js"]

