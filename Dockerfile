FROM node:18.0.0-alpine3.15
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 80
CMD ["npm", "run", "start:prod"]
