# Etapa 1: Compilación
FROM node:20-alpine AS build
WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production

# Etapa 2: Servidor de producción ligero
FROM nginx:alpine

COPY --from=build /app/dist/client/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]