import express, { urlencoded } from 'express'
import viewEngine from './config/viewEngine'
import initWebRoutes from './routes/web'
import connectDB from './config/connectDB'
require('dotenv').config() // de chay port

let app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

viewEngine(app)
initWebRoutes(app)

connectDB();

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server run in http://localhost:${port}/`);
})
