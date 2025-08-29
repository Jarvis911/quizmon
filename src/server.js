import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import quizRoutes from './routes/quizRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./utils/swagger-output.json" with { type: "json" }; 


// docker compose run app npx prisma migrate dev --name init
// node swagger.js

const app = express()
const PORT = process.env.PORT || 5000

// Go to src
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename) 

// Middleware 
app.use(express.json())
app.use(corsMiddleware)
app.use(express.static(path.join(__dirname, '../public')))
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/category', categoryRoutes);
app.use('/question', questionRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})