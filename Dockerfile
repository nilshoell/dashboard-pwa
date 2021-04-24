FROM node:lts-buster
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/server.js"]