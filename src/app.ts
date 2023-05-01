import express, { Application } from 'express'
import cors from 'cors';
import bodyParser from 'body-parser'
const app: Application = express()

import 'dotenv/config'
//config()

app.use(cors({
  origin: 'http://localhost:3000'
}));

import { connectToMongoDB } from './database'
connectToMongoDB()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

import routes from './api/routes'
app.use(routes)

const port = process.env.APP_PORT || 3100
app.listen(port, (): void => console.log(`App is running at port:${port}!`))
