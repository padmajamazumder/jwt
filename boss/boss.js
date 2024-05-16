
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path'); 
const bodyParser = require('body-parser');
const {login} = require('./login')

app.use(bodyParser.urlencoded({ extended: true }));

// Route handler for the login form POST request
app.post('/login', login);

// Define admin routes
router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'index.html'));
});

// Export the router
module.exports = router;
