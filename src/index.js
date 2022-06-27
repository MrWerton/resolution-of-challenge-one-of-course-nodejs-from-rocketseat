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
    return response.status(400).json({message: 'user not exists'})
   }

   request.user = user
   next()
}

app.post('/users', (request, response) => {
    const {username,name } = request.body;
    const userAlreadyExists = users.some(customer => customer.username === name)

    if(userAlreadyExists){
      return response.status(400).json({message: 'user already exists'})
    }
    users.push({
      name,
      id: UUIDV4(),
      username,
      todos: []
    })

    return response.status(201).send()
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  console.log(user)

  return response.send()
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;