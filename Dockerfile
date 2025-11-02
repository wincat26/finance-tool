FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json backend/
RUN cd backend && npm install

COPY backend ./backend

WORKDIR /app/backend
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
