import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes/routes.js'

const app = express()

const port = process.env.PORT

app.use("/", routes)
app.use(express.json())

app.listen(port, ()=>{
    console.log(`server is hoisted at http://localhost:${port}`);
})
