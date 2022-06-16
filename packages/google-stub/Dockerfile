FROM node:18-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .yarnrc.yml .pnp.* yarn.lock ./
COPY .yarn/ .yarn/
COPY ./packages/google-stub ./packages/google-stub

RUN yarn workspaces focus google-stub --production

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/app/packages/google-stub
CMD yarn start:${NODE_ENV}