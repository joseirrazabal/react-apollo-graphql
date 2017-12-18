FROM mhart/alpine-node:8

WORKDIR /usr/src/app

COPY package.json ./
COPY grpcComposer.js ./
COPY pubsub.js ./
COPY server.js ./
COPY tracer.js ./
COPY .babelrc ./
COPY .env ./

RUN apk add --update alpine-sdk
RUN npm install
# Para hacer deploy en producción:
# RUN npm install --only=production

COPY . .

#EXPOSE 8080
CMD [ "npm", "start" ]