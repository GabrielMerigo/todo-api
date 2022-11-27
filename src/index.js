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

  if (userExists) {
    request.username = username;
    next();
  } else {
    response.status(400).json({ error: "O username não existe" });
  }
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  if (name !== undefined && username !== undefined) {
    const user = {
      id: uuid(),
      name,
      username,
      todos: [],
    };

    users.push(user);
    response.status(200).json(user);
  } else {
    response.status(400).json({ message: "Something happen" });
  }
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const user = findUser(users, username);
  response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request;

  if (title !== undefined && deadline !== undefined) {
    const todo = {
      id: uuid(),
      title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date(),
    };
    const user = findUser(users, username);
    user.todos.push(todo);
    response.status(200).json(user);
  } else {
    response.status(400).json({ message: "something wrong" });
  }
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
