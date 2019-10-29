FROM node:8.11.1-alpine as builder

USER node
RUN mkdir -p /tmp/app
WORKDIR /tmp/app
COPY ./package*.json ./
RUN npm install
COPY --chown=node . .
RUN npm run build

FROM nginx:stable

WORKDIR /var/www
COPY --from=builder /tmp/app/build/ /var/www/


RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf.template

ENV uri \$uri

ENV PORT 4000
ENV SERVER_NAME _
CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]