# ---- Base Node ----
FROM rentpath/rp_node_alpine:node-v10.4.1_yarn-v1.7.0 AS base

WORKDIR /metrics

COPY package.json yarn.lock /metrics/

USER root

RUN apk update \
  && apk add ca-certificates wget nodejs git make curl g++ \
  && update-ca-certificates \
  && npm i -g npm \
  && npm i -g yarn pkg

RUN yarn config set registry https://registry.yarnpkg.com \
  && yarn --pure-lockfile

COPY . /metrics

RUN yarn run buildalpine

CMD sh
