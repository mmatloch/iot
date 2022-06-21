FROM node:18-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .yarnrc.yml .pnp.* yarn.lock ./
COPY .yarn/ .yarn/

COPY ./packages/common-config ./packages/common-config

COPY ./packages/tests ./packages/tests

RUN yarn workspaces focus tests --production

WORKDIR /usr/app/packages/tests
CMD yarn node --experimental-vm-modules $(yarn bin jest)