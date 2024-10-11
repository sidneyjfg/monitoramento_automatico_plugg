# Usar uma imagem do Node.js como base
FROM node:16-alpine

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar o package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install --production

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta da aplicação
EXPOSE 3003

# Comando para rodar a aplicação
CMD ["npm", "start"]
