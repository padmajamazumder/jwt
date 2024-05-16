const express = require('express');
const app = express();
const path = require('path'); 
const fs = require('fs');
const date = new Date();
const bodyParser = require('body-parser');


// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Read users data from a JSON file
let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

// Read passwords from the JSON file
const admins = JSON.parse(fs.readFileSync('admin.json', 'utf8'));

// Route handler for the login form POST request
app.post('/login', (req, res) => {
  let salt = date.getDate();
  const username = req.body.username;
  const password = req.body.password;

  // Find the user in the users array
  const user = admins.find(u => u.username === username);
  const pass = user.password + salt
  console.log(pass)
  if (user) {
    // User found, check password
    if (pass == password) {
      // Authentication successful
      res.sendFile(path.resolve(__dirname, 'boss','cpanel.html'));
    } else {
      // Authentication failed (wrong password)
      res.status(401).send('Invalid username or password');
    }
  } else {
    // User not found
    res.status(401).send('Invalid username or password');
  }
});

app.post('/add-user', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  saveUsersToFile();
  res.status(200).send("user added");
});

// Get list of users
app.get('/users', (req, res) => {
  res.json(users);
});

// Handle user deletion
app.delete('/delete-user/:username', (req, res) => {
  const username = req.params.username;
  users = users.filter(user => user.username !== username);
  saveUsersToFile();
  res.sendStatus(200);
});

const adminRoutes = require('./boss/boss');

// Middleware to serve up production assets
app.use(express.static('client/build'));

app.use('/boss', adminRoutes);

// Catch-all route to serve up the index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port:', PORT);
});

function saveUsersToFile() {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}
