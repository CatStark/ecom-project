const fs = require('fs');
const crypto = require('crypto');

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
    //Open file, and parse it from JSON to a javascript array
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8'
      })
    );
  }

  async create(attrs){ //pass the new user atributes
    attrs.id = this.randomId();
    const records = await this.getAll(); //get the latest register
    records.push(attrs);
    await this.writeAll(records);

  }

  async writeAll(records){
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId(){
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id){
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }
}

const test = async () => {
  const repo = new UsersRepository('users.json');
  const user = await repo.getOne('f0a82fs17');
  console.log(user);
};

test()
