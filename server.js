const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;


let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true})
const connection = mongoose.connection;

connection.once('open', function(){
    console.log("MongoDB connection established succesfully.");
})

todoRoutes.route('/').get(function(req, res){
    Todo.find(function(err, todos){
        if(err){
        console.log(err);
    }  else {
        res.json(todos);
    }});

});

todoRoutes.route('/:id').get(function(req, res){
    let id = req.params.id;
    Todo.findById(id, function(err, todo){
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function(req, res){
    let todo = new Todo(req.body);
    todo.save()
    .then(todo => {
        res.status(200).json({'todo': 'todo added succesfully'});
    })
    .catch(err => {
        res.status(400).send('adding new todo failed');
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function(){
    console.log("server is running on port: "+ PORT);
});