FROM node:10.15.1

ARG SOURCE_DIR="./"

# FIXME: do we need to create a separate user for this?
# RUN useradd --groups nobody --uid 400 docker-user

# RUN mkdir -p /srv/ensembl-client/ && \
#     chown -R docker-user:docker-user /srv/ensembl-client

RUN mkdir -p /srv/ensembl-client

# COPY --chown=docker-user:docker-user ${SOURCE_DIR} /srv/ensembl-client/

COPY ${SOURCE_DIR} /srv/ensembl-client/

# switch the user from root to docker-user; the commands below will be run under docker-user
# USER docker-user

# NOTE: NODE_ENV=development before npm install ensures that dev dependencies won't get skipped
RUN cd /srv/ensembl-client/ && \
    NODE_ENV=development npm install && \
    npm run test
