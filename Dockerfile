# Creates the Trial Management Tool.
#
# You can access the container using:
#   docker run -it trial-management-tool sh
# To start it stand-alone:
#   docker run -it -p 8888:3210 trial-management-tool

FROM node:alpine AS builder
RUN apk add --no-cache --virtual .gyp python make g++ git && \
  npm i -g yalc
# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
# ENV PATH=$PATH:/home/node/.npm-global/bin
RUN mkdir /packages && \
  mkdir /packages/shared && \
  mkdir /packages/gui && \
  mkdir /packages/server
COPY ./packages/shared /packages/shared
WORKDIR /packages/shared
RUN npm install && \
  npm run build:domain && \
  yalc publish --private
COPY ./packages/server /packages/server
WORKDIR /packages/server
RUN yalc add chemical-hazard-tool-models && \
  npm install && \
  npm run build:domain
COPY ./packages/gui /packages/gui
WORKDIR /packages/gui
RUN rm -fr node_modules && \
  yalc add chemical-hazard-tool-models && \
  npm install && \
  npm run build:domain

FROM node:alpine
RUN mkdir -p /app
COPY --from=builder /packages/shared/node_modules /shared/node_modules
COPY --from=builder /packages/shared/dist /shared
COPY --from=builder /packages/server/node_modules /app/node_modules
COPY --from=builder /packages/server/package.json /app/package.json
COPY --from=builder /packages/server/dist/src /app/dist
COPY --from=builder /packages/server/.yalc /app/.yalc
COPY --from=builder /packages/gui/dist /app/public
WORKDIR /app
EXPOSE 3333
CMD ["node", "./dist/index.js"]
