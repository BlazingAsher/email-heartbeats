FROM node:20-alpine3.19
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=America/Toronto
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk add dumb-init

EXPOSE 3000

#COPY knexfile.js .
COPY package*.json .
#COPY migrations migrations
RUN npm ci
COPY src src

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "./src/app.js"]