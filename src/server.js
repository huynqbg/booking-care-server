import express, { urlencoded } from 'express';
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
import connectDB from './config/connectDB';
import cors from 'cors';

require('dotenv').config(); // de chay port

let app = express();

app.use(
  cors({
    origin: 'https://booking-care-client.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server run in http://localhost:${port}/`);
});
