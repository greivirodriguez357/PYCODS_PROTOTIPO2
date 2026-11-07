# ---------- Etapa 1: compilar Angular ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build -- --configuration production

# ---------- Etapa 2: servir con Nginx en 4042 ----------
FROM nginx:alpine
COPY --from=build /app/dist/pycods-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4042
CMD ["nginx", "-g", "daemon off;"]
