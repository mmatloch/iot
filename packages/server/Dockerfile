# Stage 1
FROM node:18.7-alpine as builder

WORKDIR /usr/app

COPY package.json .yarnrc.yml .pnp.* yarn.lock ./
COPY .yarn/ .yarn/

COPY ./packages/common-application ./packages/common-application
COPY ./packages/common-config ./packages/common-config
COPY ./packages/common-errors ./packages/common-errors
COPY ./packages/common-validator ./packages/common-validator
COPY ./packages/common-logger ./packages/common-logger
COPY ./packages/static ./packages/static

COPY ./packages/server ./packages/server

RUN yarn workspaces focus server
RUN yarn workspace server run build

# Stage 2
FROM node:18.7-alpine

WORKDIR /usr/app/packages/server

COPY --from=builder /usr/app/packages/server/package.json ./
COPY --from=builder /usr/app/packages/server/config ./config
COPY --from=builder /usr/app/packages/server/dist ./dist

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

CMD node ./dist/index.js