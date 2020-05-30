const express = require('express')
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended:true })); //every req handler in the app will use this middleware parser
app.use(cookieSession({
  keys: ['sdfasdfuyhkjlgsdfffsfhr']
}));

app.use(authRouter);

app.listen(3000, () => {
  console.log('Listening');
});
