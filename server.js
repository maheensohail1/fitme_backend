const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
const multer= require('multer');
const dproutes= express.Router();

let Todo = require('./todo.model');
let DP= require('./dp.model')

var storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, 'uploads/')
    },
    filename:(req,file,cb) =>{
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req,file,cb) =>{
        const ext = path.extname(file.originalname)
        if(ext !== '.jpg' || ext!=='.png'){
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})
var upload = multer({ storage: storage}).single("file")




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

todoRoutes.route('/addImage').post(function(req, res){
     
    upload(req,res,err => {
        if(err) return res.json({ success: false, err})
        return res.json({ success: true, image:res.req.file.path, fileName: res.req.file.filename})
    })
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

todoRoutes.route('/').post(function(req, res){
    let todo = new Todo(req.body);
    todo.save()
    .then(todo => {
        res.status(200).json({'todo': 'todo added succesfully'});
    })
    .catch(err => {
        res.status(400).send('adding new todo failed');
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

todoRoutes.route('/getTodos').post(function(req, res){
    
    Todo.find(function(err, todos){
        if(err){
        return res.status(400).json({ success:false, err})
    
    }  else {
        res.status(200).json({ success: true, todos});
    }});

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

dproutes.route('/add').post(function(req, res){
    let dp = new DP(req.body);
    dp.save()
    .then(dp => {
        res.status(200).json({'dp': 'dietplan added succesfully'});
    })
    .catch(err => {
        res.status(400).send('adding new dietplan failed');
    });
});

dproutes.route('/getDPs').post(function(req, res){
    
    DP.find(function(err, dps){
        if(err){
        return res.status(400).json({ success:false, err})
    
    }  else {
        res.status(200).json({ success: true, dps});
    }});

});

app.use('/todos', todoRoutes);

var Users = require('./routes/Users')
app.use('/users', Users)
app.use('/uploads', express.static('uploads'));


app.use('/DP', dproutes);

app.listen(PORT, function(){
    console.log("server is running on port: "+ PORT);
}); 
//change1