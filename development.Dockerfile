FROM node:15.14.0-alpine

WORKDIR /app/frontend

ENV PATH /app/frontend/node_modules/.bin:$PATH

COPY package.json \
     yarn.lock \
     ./

RUN apk update \
    && apk add bash

RUN yarn install --silent \
    && yarn global add \
       react-scripts@4.0.3 --silent \

COPY . .

# build app
RUN yarn run start