FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
