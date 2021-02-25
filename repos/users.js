const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("creating a repository requires filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    //open file called this.filename
    const contents = await fs.promises.readFile(this.filename, {
      encoding: "utf8",
    });
    //read contents
    // console.log(contents);
    //parse contents
    const data = JSON.parse(contents);
    //returned parsed data
    return data;
  }

  async create(attributes) {
    //grab randomID from #48
    attributes.id = this.randomId();

    //load contents of users.json file
    const records = await this.getAll();
    records.push(attributes);
    await this.writeAll(records);
  }

  async writeAll(records) {
    //write updated records array back to this.filename
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
    //then, assign that method to the create funct=
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attributes) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record you were looking for (${id}) not found`);
    }

    Object.assign(record, attributes);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

//create variable to put async variable in as it is only way it will run
// const test = async () => {
//   const repo = new UsersRepository("users.json");

//   const user = await repo.getOneBy({ email: "djojd" });
//   console.log(user);
// };

// test();

module.exports = new UsersRepository("users.json");
