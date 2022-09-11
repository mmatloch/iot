FROM node:18.7-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .yarnrc.yml .pnp.* yarn.lock ./
COPY .yarn/ .yarn/

COPY ./packages/common-application ./packages/common-application
COPY ./packages/common-config ./packages/common-config
COPY ./packages/common-errors ./packages/common-errors
COPY ./packages/common-validator ./packages/common-validator
COPY ./packages/common-logger ./packages/common-logger

COPY ./packages/stubs ./packages/stubs

RUN yarn workspaces focus stubs

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/app/packages/stubs
CMD yarn dev