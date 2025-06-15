# 최신 Node + Alpine 이미지
FROM node:alpine AS deps

# pnpm 수동 설치
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

# 실행용 이미지
FROM node:alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=deps /app ./

EXPOSE 3000

CMD ["pnpm", "start"]