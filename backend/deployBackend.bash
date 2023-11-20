#!/bin/bash

# Apagar o diretório build caso exista
sudo rm -rf out

# Atualizar as dependências do Node.js caso necessário
npm install

# Buildar a aplicação
npm run package

# Reiniciar o processo no PM2 para carregar as alterações
pm2 reload backend-pepvagas

echo "Deploy do backend feito com sucesso!"