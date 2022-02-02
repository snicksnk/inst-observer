FROM node:16.13.2

ARG NPM_TOKEN

WORKDIR /app

RUN apt update

RUN apt-get install gettext-base -y

RUN npm install -g @nestjs/cli

COPY package.json .npmrc ./

RUN echo "$(envsubst < .npmrc)" > .npmrc && cp .npmrc ~/

RUN npm i

COPY . .

CMD ["npm", "run", "start:dev"]
