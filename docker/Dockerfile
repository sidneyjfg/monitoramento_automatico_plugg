# Usar uma imagem base leve do Node.js
FROM node:14-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências da aplicação
RUN npm install --only=production

# Copiar todo o código da aplicação para o diretório de trabalho
COPY . .

# Expor a porta necessária
EXPOSE 3003

# Definir o comando padrão para iniciar a aplicação
CMD ["node", "src/app.ts"]
