# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM node:latest AS builder

COPY package*.json /usr/src/
WORKDIR /usr/src/
RUN npm install --include=dev
ENV PATH /usr/src/node_modules/.bin:$PATH

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN apt update
RUN apt install -y vim

EXPOSE 5173
CMD [ "npm","run","dev"]