FROM node:12 as builder

WORKDIR /vitalsigns-patiean

COPY ./package.json ./

RUN yarn cache clean && yarn install

COPY . .

RUN CI=true yarn test && yarn build:pwa

FROM nginx:1.17.9-alpine
COPY --from=builder /vitalsigns-patiean/dist/pwa /var/www
COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /root

RUN chmod 700 /root/entrypoint.sh

EXPOSE 80
CMD ["/root/entrypoint.sh"]

