FROM node:17-alpine as build-image
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN npm i
# RUN npm i typescript
# RUN npx tsc

FROM node:17-alpine
WORKDIR /usr/src/app
COPY --from=build-image ./usr/src/app/package*.json ./
# COPY --from=build-image ./usr/src/app/dist ./dist
RUN npm ci --omit=dev
RUN npm i tsx
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
