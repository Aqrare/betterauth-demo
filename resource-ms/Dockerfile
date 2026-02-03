# Bunのベースイメージを使用
FROM oven/bun:1.3-alpine

WORKDIR /app

COPY package.json ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 4001

CMD ["bun", "run", "dev"]
