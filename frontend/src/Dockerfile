# stage1 - build react app first
FROM node:14-alpine

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk add alpine-sdk

WORKDIR /app
COPY package.json .
RUN  rm -rf node_module
RUN npm install
COPY . .
CMD ["npm", "start"]