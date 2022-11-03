FROM node:18.12.0 AS builder

ARG SOURCE_DIR="./"

RUN mkdir -p /srv/ensembl-client

COPY ${SOURCE_DIR} /srv/ensembl-client/

WORKDIR /srv/ensembl-client/

RUN npm install --global npm@8.1.0 && \
    npm ci --loglevel warn && \
    npm run test && \
    npm run build


# PRODUCTION IMAGE
FROM node:18.12.0-alpine AS runner

WORKDIR /srv/ensembl-client/

ENV NODE_ENV=production
COPY --from=builder /srv/ensembl-client/package* .
COPY --from=builder /srv/ensembl-client/dist ./dist

RUN npm ci --only=production --ignore-scripts

EXPOSE 8080
CMD [ "node", "dist/server/server.js" ]
