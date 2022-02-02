FROM node:16.13.2

ARG NPM_TOKEN

WORKDIR /app

RUN apt update

RUN apt-get install gettext-base -y

RUN npm install -g @nestjs/cli
# COPY package.json .

COPY . .

RUN enbsubst < .npmrc > .npmrc && cat .npmrc

RUN npm install

# RUN yarn add instagram-private-api

RUN cat package.json

CMD ["npm", "run", "start:dev"]
