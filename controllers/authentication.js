const jwt = require('jwt-simple');
const config = require('../config')
const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(422).send({ error: 'Please provide email AND password' })
  }
  //check if uset w given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // if user does exist return Error
    if (existingUser) {
      return res.status(422).send({ error: 'Email in use' });
    }

    // if user w emai does not exist, create and save user record
    const user = new User ({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });


  });
}
