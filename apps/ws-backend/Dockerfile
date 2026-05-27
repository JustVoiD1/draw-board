FROM node:20-bookworm-slim

WORKDIR /app

ENV CI=true
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm exec turbo run build --filter=ws-backend

EXPOSE 8080

CMD ["pnpm", "--filter", "ws-backend", "start"]