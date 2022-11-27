function findUser(users, username) {
  return users.find((user) => user.username === username);
}

module.exports = findUser;
