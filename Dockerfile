FROM node:20-slim

COPY package.json package.json
RUN npm install


COPY . .
RUN npm run build

ENV NODE_ENV=production

CMD [ "npm", "start" ]
