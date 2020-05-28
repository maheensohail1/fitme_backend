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

app.use(
    bodyParser.urlencoded({
        extended: false
    })
)


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

todoRoutes.route('/delete/:id').delete(function(req, res){
    let id = req.params.id;
    Todo.findById(id, function(err, todo){
        
        todo.remove()
        .then(todo => {
            res.status(200).json({'todo': 'session deleted succesfully'});
        })
        .catch(err => {
            res.status(400).send('deleting the session failed');
        });
        
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

todoRoutes.route('/update/:id').post(function(req,res){
    Todo.findById(req.params.id, function(err, todo){
        if(!todo)
        res.status(404).send('data not found');
        else
            todo.session_title = req.body.session_title;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/todos', todoRoutes);

var Users = require('./routes/Users')
app.use('/users', Users)

app.listen(PORT, function(){
    console.log("server is running on port: "+ PORT);
}); 
//change1