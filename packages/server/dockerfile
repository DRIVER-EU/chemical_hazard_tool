FROM node:11-alpine as builder
RUN mkdir -p ./code
COPY package.json /code/package.json
WORKDIR /code
RUN yarn
COPY . .
RUN yarn build

FROM node:11-alpine
RUN mkdir -p /node_adapter
COPY --from=builder /code/dist /node_adapter/dist
COPY --from=builder /code/src/schemas /src/schemas
COPY --from=builder /code/node_modules /node_adapter/node_modules
CMD ["node", "/node_adapter/dist/silent-producer.js"]
