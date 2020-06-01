const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository{
  async createElement(attrs){ //Create user and return it
    //attrs =  {email, password}
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll(); //get the latest register
    const record  = { //replace the pwd with a new hashed & salted pwd
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    };
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied){
    //saved pwd = pwd saved in the database ie: 'pwdtest.salt'
    //supplied = pwd given by the user ie: 'pwdtest'
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString('hex');
  }
}

module.exports = new UsersRepository('users.json');
