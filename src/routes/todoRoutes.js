import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all to do for log in user
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

// Create a new to do
router.post('/', (req, res) => {
    const { task } = req.body
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?,?)`)
    const result = insertTodo.run(req.userId, task)

    res.json({id: result.lastInsertRowid, task, completed: 0})
})

// Update a to do
router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params

    const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    updatedTodo.run(completed, id)
    res.json({message: "To do updated"})
})

// Delete a to do
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const deletedTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')

    deletedTodo.run(id, req.userId)
    res.json({message: "To do deleted"})
})

export default router