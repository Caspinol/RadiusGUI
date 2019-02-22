FROM node:11.0

ENV APP_ROOT /radius_gui_app

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN npm install
RUN npm run build

EXPOSE 3000

ENV HOST 0.0.0.0