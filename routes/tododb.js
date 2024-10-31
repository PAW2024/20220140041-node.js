const express = require('express');
const router = express.Router();

// Ensure this path is consistent and correct, based on the actual structure
const db = require('../Database/db'); // Adjust if needed to match the actual path

// Endpoint to get all tasks
router.get('/', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            console.error("Error retrieving todos:", err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

// Endpoint to get a task by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error("Error retrieving todo by ID:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) return res.status(404).send('Task not found');
        res.json(results[0]);
    });
});

// Endpoint to add a new task
router.post('/', (req, res) => {
    const { task } = req.body;
    if (!task || task.trim() === '') {
        return res.status(400).send('Task cannot be empty');
    }

    db.query('INSERT INTO todos (task, completed) VALUES (?, false)', [task.trim()], (err, results) => {
        if (err) {
            console.error("Error adding new todo:", err);
            return res.status(500).send('Internal Server Error');
        }
        const newTodo = { id: results.insertId, task: task.trim(), completed: false };
        res.status(201).json(newTodo);
    });
});

// Endpoint to update a task
router.put('/:id', (req, res) => {
    const { task, completed } = req.body;

    if (typeof task !== 'string' || task.trim() === '') {
        return res.status(400).send('Task cannot be empty or must be text');
    }

    if (typeof completed !== 'boolean') {
        return res.status(400).send('Completed must be a boolean');
    }

    db.query(
        'UPDATE todos SET task = ?, completed = ? WHERE id = ?',
        [task.trim(), completed, req.params.id],
        (err, results) => {
            if (err) {
                console.error("Error updating todo:", err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) return res.status(404).send('Task not found');
            res.json({ id: req.params.id, task: task.trim(), completed });
        }
    );
});

// Endpoint to delete a task
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error("Error deleting todo:", err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) return res.status(404).send('Task not found');
        res.status(204).send();
    });
});

module.exports = router;
