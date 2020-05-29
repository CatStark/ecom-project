const express = require('express');
const { check, validationResult } = require('express-validator');


const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(`
    <div>
      Your ID is: ${req.session.userId}
      <form method = "POST">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
        <input name="passwordConfirmation" placeholder="password confirmation"/>
        <button>Sign up</button>
      </form>
    </div>`
  );
});

router.post('/signup', [
  check('email').trim().normalizeEmail().isEmail(),
  check('password').trim().isLength({min: 4, max: 20}),
  check('passwordConfirmation').trim().isLength({min: 4, max: 20})
  ],
  async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  const {email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneBy({ email }); //if this email already exists
  if (existingUser){
    return res.send('Email already exists!');
  }

  if(password !== passwordConfirmation)
    return res.send('The passwords don\'t match');

  //Create user in user repo
  const user = await usersRepo.createElement({email: email, password: password});
  req.session.userId = user.id;

  res.send("Account created!");
});

router.get('/signin', (req, res) => {
  res.send(`
    <div>
      <form method = "POST">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
        <button>Sign in</button>
      </form>
    </div>`
  );
});

router.post('/signin', async (req, res) => {
  const {email, password} = req.body; //this is the data the user just wrote
  const existingUser = await usersRepo.getOneBy({ email });

  if(!existingUser)
    return res.send('User doesnt exist!');

  const validPwd = await usersRepo.comparePasswords(
    existingUser.password,
    password
  );

  if(!validPwd)
    return res.send('Wrong password!');

  req.session.userId = existingUser.id;
  res.send('You are signed in!');
});

router.get('/signout', (req, res) =>{
  req.session = null;
  res.send('You are logged out!');
});

module.exports = router;
