import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

const app = express()
const PORT = process.env.PORT || 5000

// Go to src
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename) 

// Middleware 
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})