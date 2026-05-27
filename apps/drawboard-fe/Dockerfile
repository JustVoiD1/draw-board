FROM node:20-bookworm-slim

WORKDIR /app

ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8080
ARG INTERNAL_BACKEND_URL=http://http-backend:4000
ARG INTERNAL_WS_URL=ws://ws-backend:8080

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV INTERNAL_BACKEND_URL=${INTERNAL_BACKEND_URL}
ENV INTERNAL_WS_URL=${INTERNAL_WS_URL}

RUN pnpm install --frozen-lockfile
RUN pnpm exec turbo run build --filter=drawboard-fe

EXPOSE 3000

CMD ["pnpm", "--filter", "drawboard-fe", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]