FROM node:20.18-alpine AS BUILDER

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:20.18-alpine AS PRODUCTION

WORKDIR /usr/src/app

COPY --from=BUILDER /usr/src/app /usr/src/app/

EXPOSE 4000

CMD ["npx prisma generate && npx prisma db push && npm run start:prod" ]


