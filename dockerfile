FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN apk add git make gcc g++ alpine-sdk python3 py3-pip python2 unzip
RUN git clone https://github.com/mx-space/assets.git --depth=1
RUN rm -rf assets/.git
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm bundle
RUN node scripts/download-latest-admin-assets.js

FROM node:16-alpine
RUN apk add zip unzip mongodb-tools bash zsh rsync --no-cache
WORKDIR /app
COPY --from=builder /app/out .
COPY --from=builder /app/assets ./assets
ENV TZ=Asia/Shanghai
EXPOSE 2333

CMD echo "MixSpace Sever Image." && sh
