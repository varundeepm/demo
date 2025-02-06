// server.js
const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];

app.post('/add-task', (req, res) => {
    tasks.push(req.body.task);
    res.send({ message: "Task added!", tasks });
});

app.listen(3000, () => console.log("Server running on port 3000"));
