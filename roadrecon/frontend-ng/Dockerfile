# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM node:latest AS builder

COPY . /usr/src/app

# automatically creates the dir and sets it as the current working dir
WORKDIR /usr/src/app
# this will allow us to run vite and other tools directly
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm install --include=dev

RUN apt install -y vi

CMD [ "npm","run","dev"]