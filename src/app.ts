import express, { Application } from 'express'
import bodyParser from 'body-parser'
const app: Application = express()

import { config } from 'dotenv'
config()


import { connectToMongoDB } from './database'
connectToMongoDB()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

import userRoutes from './api/routes/user.route'
app.use('/api/users', userRoutes)

const port = process.env.APP_PORT || 3000
app.listen(port, (): void => console.log(`App is running at port:${port}!`))
