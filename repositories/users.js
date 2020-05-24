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

  async getAll(){ //get all the users
    //Open filen
    const content = await fs.promises.readFile(this.filename, {
      encoding: 'utf8'
    });
    //Read its content
    console.log(content)
    //Parse the content
    //Return parsed data
  }
}



const test = async () => {
  const repo = new UsersRepository('users.json');
  await repo.getAll();
}

test()
