var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  {usermodel} = require('../schemas/userschema')

exports.register = function(req, res) {
  var newUser = new usermodel(req.body);
  console.log(req.body);
  console.log("newUser:",newUser);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);

  usermodel.findOne({
    username : newUser.username
  },function(err,user){
    if (err) throw err;
    if (user) {
      return res.status(400).send({message:"User with this username already exists"});
    }
    else{
      newUser.save(function(err, user) {
        if (err) {
          return res.status(400).send({message: err});
        } else {
          user.hash_password = undefined;
          return res.json(user);
        }
      });
    }

  }

  )

};

exports.sign_in = function(req, res) {
  usermodel.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }

    return res.json({ username: user.username, token: jwt.sign({ username: user.username, _id: user._id, expiresIn: '24h' }, 'RESTFULAPIs') });
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {

    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};

exports.profile = function(req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } 
  else {
   return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.logout = function (req, res) {
    const authHeader = req.headers["authorization"];
    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
        if (logout) {
            res.send({msg : 'You have been Logged Out' });
        } else {
            res.send({msg:'Error'});
        }
    });
};