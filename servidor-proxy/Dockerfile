FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci --only=production || npm install

# Copiar código
COPY server.js .

# Puerto que escucha
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
