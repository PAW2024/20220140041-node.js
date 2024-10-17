const express = require('express');
const router = express.Router();

let todos = [
    {
        id: 1,
        task: "Belajar Node.js",
        completed: false
    },
    {   
        id: 2,
        task: "Membuat API",
        completed: false
    }
];

router.get('/', (req, res) => {res.json(todos);});

router.post('/', (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        task: req.body.task,
        completed: false
    };
    todos.push(newTodo);
    req.statusCode(201).json(newTodo);
});

module.exports = router;