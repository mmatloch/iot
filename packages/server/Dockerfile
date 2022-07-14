FROM node:18-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .yarnrc.yml .pnp.* yarn.lock ./
COPY .yarn/ .yarn/

COPY ./packages/common-application ./packages/common-application
COPY ./packages/common-config ./packages/common-config
COPY ./packages/common-errors ./packages/common-errors
COPY ./packages/common-validator ./packages/common-validator
COPY ./packages/common-logger ./packages/common-logger

COPY ./packages/server ./packages/server

RUN yarn workspaces focus server --production

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/app/packages/server
CMD yarn start:${NODE_ENV}