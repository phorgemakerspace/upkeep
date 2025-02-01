# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

COPY src/client/package*.json src/client/
COPY src/client/tailwind.config.js src/client/
COPY src/client/postcss.config.js src/client/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build client
RUN cd src/client && npm install && npm run build

# Expose ports
EXPOSE 3000
EXPOSE 5173

CMD ["npm", "start"]

# docker-compose.yml
# version: '3.8'

# services:
#   app:
#     build: .
#     ports:
#       - "3000:3000"
#       - "5173:5173"
#     environment:
#       - DB_HOST=db
#       - DB_USER=${DB_USER}
#       - DB_PASSWORD=${DB_PASSWORD}
#       - DB_NAME=${DB_NAME}
#     depends_on:
#       - db
#     volumes:
#       - .:/app
#       - /app/node_modules

#   db:
#     image: mariadb:latest
#     ports:
#       - "3306:3306"
#     environment:
#       - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
#       - MYSQL_DATABASE=${DB_NAME}
#       - MYSQL_USER=${DB_USER}
#       - MYSQL_PASSWORD=${DB_PASSWORD}
#     volumes:
#       - db_data:/var/lib/mysql
#       - ./src/server/db/migrations:/docker-entrypoint-initdb.d

# volumes:
#   db_data: