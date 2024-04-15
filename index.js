const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MG_USER}:${process.env.MG_PASS}@swift-sell-rent.eecu0il.mongodb.net/?retryWrites=true&w=majority&appName=swift-sell-rent`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    // create Users
    app.post("/signUp", async (req, res) => {
      const { username, email, password } = req.body;
      const hashedPassword =  bcrypt.hashSync(password, 10)
      const newUser = new User({ username, email, password: hashedPassword });
      try{
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
      }
      catch(error){
        res.status(500).json(error.message);
      }
    });


    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("swift sell rent running");
});

app.listen(port, () => {
  console.log(`swift sell rent running on port ${port}`);
});
