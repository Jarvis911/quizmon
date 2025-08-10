import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';


const app = express()
const PORT = process.env.PORT || 5003

// Go to src
const __filename = fileURLToPath(import.meta.url)
// Go to chapter_3
const __dirname = dirname(__filename) 


// Middleware 
app.use(express.json())

// Lead to an error that its look in chapter_3/src/public
// Tell express that serve all file from public folder as static assets
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})