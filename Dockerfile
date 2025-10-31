FROM node:18-alpine

WORKDIR /app

# 複製後端文件
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend/ ./backend/
RUN cd backend && npm run build

EXPOSE 3001

CMD ["sh", "-c", "cd backend && npm start"]