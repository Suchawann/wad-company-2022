var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST new users */
router.post('/login', function(req, res, next) {

  const predefinedUsers = [
    { email: "abc@xyz.com", password: "123", name: "Regular User", isAdmin: false},
    { email: "xyz@abc.com", password: "123", name: "Admin User", isAdmin: true},
  ];

  const data = req.body;

  // Return if email and password matches, meaning user exist
  const foundUser = predefinedUsers.find(u => u.email == data.email && u.password == data.password)
  console.log(data)
  console.log(foundUser)

  // If foundUser = true
  if (foundUser) {
    // Don't send password back to the client
    delete foundUser.password
    // Return the found user
    res.send(foundUser)
  } else {
    res.send({error: "User not found!"})
  }

  // Don't send password back to the client
  delete foundUser.password

  res.send('Login');
});

module.exports = router;
