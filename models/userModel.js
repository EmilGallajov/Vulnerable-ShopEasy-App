const users = [
  { id: 1, username: "samir", password: "samir123" },
  { id: 2, username: "emil", password: "emil123" }
];

module.exports = {
  getUserByUsername: (username) => users.find(u => u.username === username),
  getUserById: (id) => users.find(u => u.id == id)
}; 