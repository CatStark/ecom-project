const express = require('express')
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');
const cookieSession = require('cookie-session');

const app = express();
app.use(bodyParser.urlencoded({ extended:true })); //every req handler in the app will use this middleware parser
app.use(cookieSession({
  keys: ['sdfasdfuyhkjlgsdfffsfhr']
}));

app.get('/', (req, res) => {
  res.send(`
    <div>
      Your email is: ${req.session.email}
      <form method = "POST">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
        <input name="passwordConfirmation" placeholder="password confirmation"/>
        <button>Sign up</button>
      </form>
    </div>`
  );
});

app.post('/', async (req, res) => {
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
  req.session.email = user.email;

  res.send("Account created!");
});

app.listen(3000, () => {
  console.log('Listening');
})
