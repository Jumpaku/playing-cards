FROM node:16-bullseye

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update -y && apt install -y npm git curl jq \
    && npx -y n 16.15.0 \
    && npm install -g npm@8.8.0
RUN npm install -g \
    typescript \
    rollup \
    terser \
    eslint \
    prettier eslint-config-prettier \
    jest
WORKDIR /app