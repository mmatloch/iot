FROM node:18-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .yarnrc.yml .pnp.* yarn.lock ./
COPY .yarn/ .yarn/
COPY ./packages/server ./packages/server

RUN yarn workspaces focus server --production

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/app/packages/server
CMD yarn start:${NODE_ENV}