const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");
const findUser = require("./utils/findUser");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const userExists = users.find((user) => user.username === username);

  if (!userExists)
    response.status(400).json({ error: "O username não existe" });

  request.username = username;
  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const userExists = users.some((user) => user.username === username);

  if (userExists) response.status(400).json({ error: "User already exists" });

  const user = {
    id: uuid(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const user = findUser(users, username);
  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request;
  const user = findUser(users, username);

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
  const user = findUser(users, username);
  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json({ error: "Todo not found!" });

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;
  const user = findUser(users, username);
  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) return response.status(404).json({ error: "Todo not found!" });

  todo.done = true;

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const user = findUser(users, username);
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex < 0)
    return response.status(404).json({ error: "Todo not found!" });

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();
});

module.exports = app;
