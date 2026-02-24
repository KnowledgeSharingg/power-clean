# 최신 Node + Alpine 이미지
FROM node:alpine AS deps

# pnpm 수동 설치
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# NEXT_PUBLIC_* 변수는 빌드 타임에 인라인되므로 ARG로 전달
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

# 실행용 이미지
FROM node:alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=deps /app ./

EXPOSE 3000

CMD ["pnpm", "start"]