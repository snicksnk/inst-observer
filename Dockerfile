FROM node:16.13.2

ARG NPM_TOKEN

WORKDIR /app

RUN apt update

RUN apt-get install gettext-base -y

COPY . .

RUN echo "$(envsubst < .npmrc)" > .npmrc

RUN npm install -g @nestjs/cli

RUN npm install typedi @igpapi/core
RUN npm i
RUN npm run prisma:gen
RUN npm run prisma:migrate
CMD ["npm", "run", "start"]
