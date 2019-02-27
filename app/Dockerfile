FROM node:alpine

ENV APP_ROOT /radius_gui

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

ENV HOST 0.0.0.0
ENV NODE_ENV production

RUN npm install
RUN npm run build

EXPOSE 3000