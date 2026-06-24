FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package.json package-lock.json* ./
RUN npm install

# Copia o código
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Inicia o servidor de desenvolvimento acessível externamente
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
