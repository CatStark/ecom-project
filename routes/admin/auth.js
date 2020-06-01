const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPassword} =  require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post('/signup', [
  requireEmail,
  requirePassword,
  requirePasswordConfirmation
  ],
  handleErrors(signupTemplate),
  async (req, res) => {
  const {email, password } = req.body;

  //Create user in user repo
  const user = await usersRepo.createElement({email: email, password: password});
  req.session.userId = user.id;

  res.send("Account created!");
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({  }));
});

router.post('/signin',
  [
    requireEmailExists,
    requireValidPassword
  ],
  handleErrors(signinTemplate),
  async (req, res) => {

  const {email} = req.body; //this is the data the user just wrote

  const user = await usersRepo.getOneBy({ email });
  if(!user)
    throw new Error('Something went wrong! :()');
  else {
    req.session.userId = user.id;
    res.send('You are signed in!');
  }


});

router.get('/signout', (req, res) =>{
  req.session = null;
  res.send('You are logged out!');
});

module.exports = router;
