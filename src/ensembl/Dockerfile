FROM node:10.15.1

ARG SOURCE_DIR="./"

RUN mkdir -p /srv/ensembl-client

COPY ${SOURCE_DIR} /srv/ensembl-client/

# NOTE: NODE_ENV=development before npm install ensures that dev dependencies won't get skipped
RUN cd /srv/ensembl-client/ && \
    NODE_ENV=development npm install && \
    npm run test
