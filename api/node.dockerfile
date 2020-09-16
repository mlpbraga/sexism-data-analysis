FROM node:10-alpine

RUN \
  apk add --update --no-cache git openssh-client \
  && npm install -g nodemon

# RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /node-app