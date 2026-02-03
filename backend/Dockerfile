# Bunのベースイメージを使用
FROM oven/bun:1.3-alpine

# ビルドツールをインストール（better-sqlite3のネイティブモジュールビルドに必要）
# python3: node-gypの実行に必要
# g++: C++コンパイラ
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile
COPY . .

EXPOSE 3000

CMD ["bun", "dev"]
