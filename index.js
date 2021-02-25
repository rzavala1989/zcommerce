const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repos/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post("/", async (req, res) => {
  //once submitted, extract these three out of the req.body
  const { email, password, passwordConfirmation } = req.body;
  //check to see if a user exists already in repository
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) return res.send("Email in use already");
  if (password !== passwordConfirmation)
    return res.send("Passwords do not match");
  res.send("Account created!!!");
});

app.listen(3000, () => {
  console.log("Listening");
});
