const express = require('express');
const cors = require('cors');

const { v4: UUIDV4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
    const {username} = request.headers; 
   const user = users.find(item => item.username === username)

   if(!user){
    return response.status(404).json({error: 'user not exists'})
   }

   request.user = user
   next()
}

app.post('/users', (request, response) => {
    const {username,name } = request.body;
    const userAlreadyExists = users.some(user => user.username === username)

    if(userAlreadyExists){
      return response.status(400).json({error: 'user already exists'})
    }
    const user = {
      name,
      id: UUIDV4(),
      username,
      todos: []
    }
    users.push(user)

    return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;

  const todo = {
    title,
    deadline,
    done: false,
    created_at: new Date(),
    id: UUIDV4()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params
  const {title, deadline} = request.body;

  const todo = user.todos.find(todo=> todo.id ===id);
  if(!todo){
    return response.status(404).json({error: "todo not found"})
  }
  todo.deadline = new Date(deadline);
  todo.title = title

  return response.status(201).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params

  const todo = user.todos.find(todo=> todo.id ===id);

  if(!todo){
    return response.status(404).json({error: "todo not found"})
  }

  todo.done = !todo.done

  return response.status(201).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params

  const todo = user.todos.findIndex(todo=> todo.id ===id);

  if(todo){
    return response.status(404).json({error: "todo not found"})
  }
  user.todos.splice(todo, 1);


  return response.status(204).json(todo)
});

module.exports = app;