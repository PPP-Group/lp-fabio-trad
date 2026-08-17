# Etapa 1 — compila o site com o Vite.
FROM node:22-alpine AS build

WORKDIR /app

# As dependências entram antes do código para aproveitar o cache de camadas.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2 — serve apenas o resultado da compilação.
FROM nginx:1.27-alpine AS serve

# A configuração própria substitui a padrão: ela é quem garante o Content-Type
# correto dos módulos e o fallback de página única.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/site.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
