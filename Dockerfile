FROM node:20-slim

COPY package.json package.json
RUN npm install

COPY . .
CMD ["npm", "start"]
