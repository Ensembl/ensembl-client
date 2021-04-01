FROM node:14.16.0

ARG SOURCE_DIR="./"

RUN mkdir -p /srv/ensembl-client

COPY ${SOURCE_DIR} /srv/ensembl-client/

# NOTE: NODE_ENV=development before npm install ensures that dev dependencies won't get skipped
RUN cd /srv/ensembl-client/ && \
    npm install --global npm@7.6.2 && \
    npm ci && \
    npm run test
