FROM node:20.17.0-alpine

WORKDIR /vue3cli-puppeteer

ARG WEBSITE

COPY . .

RUN apk add chromium

RUN npm i

RUN npm run build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD node app.js ${WEBSITE}