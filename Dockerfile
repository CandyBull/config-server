FROM node:8

RUN apt-get update && apt-get install -y net-tools vim telnet

LABEL gateway.version=$VERSION
LABEL gateway.build_date=$BUILD_DATE

WORKDIR /usr/src/app

ADD . .
RUN npm install

EXPOSE 3039

CMD npm run start
