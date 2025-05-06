# Usa a imagem oficial do Nginx
FROM nginx:alpine

# Copia os arquivos do site para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80
