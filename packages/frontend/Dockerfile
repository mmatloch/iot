# Stage 1
FROM node:18.5-alpine as builder

WORKDIR /usr/app

COPY package.json .yarnrc.yml .pnp.* yarn.lock ./
COPY .yarn/ .yarn/

COPY ./packages/frontend ./packages/frontend

RUN yarn workspaces focus frontend
RUN yarn workspace frontend run build

# Stage 2
FROM nginx:1.22

COPY --from=builder /usr/app/packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]