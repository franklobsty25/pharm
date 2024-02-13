import http from 'http';
import app from './app.js';
import mongoose from 'mongoose';
import 'dotenv/config';

const port = 3000;
const server = http.createServer(app);

server.listen(port, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`[server]: Server running at http://localhost:${port}`);

  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log('[database]: Database connected successfully');
    })
    .catch((error) => {
      console.error(`[error]: Error connecting to database: ${error.message}`);
    });
});
