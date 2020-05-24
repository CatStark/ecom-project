const fs = require('fs');

class UsersRepository{
  constructor(filename){
    if(!filename)
      throw new Error('Creating a repository requires a filename');
    this.filename = filename;

    try{ //Check if the file exists
      fs.accessSync(this.filename)
    }catch(err){ //if it doesnt, create it
      fs.writeFileSync(this.filename, '[]');
    }
  }
}



const repo = new UsersRepository('users.json');
