FROM node:lts-alpine as build

WORKDIR /build
COPY . .
RUN npm ci && \
  npx ng build

FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist/actio /usr/share/nginx/html
