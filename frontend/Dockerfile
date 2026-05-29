FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite default on 5173
EXPOSE 5173

# Start
CMD ["npm", "run", "dev", "--", "--host"]