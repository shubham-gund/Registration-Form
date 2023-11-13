const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv =require("dotenv");

const app = express();
dotenv.config();

const PORT = process.env.port || 3000;

// Connect to MongoDB (Make sure MongoDB is running)
const username =process.env.MONGODB_USERNAME;
const password =process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.esamsew.mongodb.net/registrationformDB`, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a user schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Create a User model based on the schema
const Registration =mongoose.model('Registration', registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// Handle GET request for the registration form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/index.html');
});

// Handle POST request for user registration
app.post('/register',async (req, res) => {
    try {
      const {name,email,password}=req.body;

      const existingUser =await Registration.findOne({email:email});
      if(!existingUser){
        const registrationData=new Registration({
          name,
          email,
          password
        });
        await registrationData.save();
        res.redirect("/success");
      }
      else{
        console.log("User already exists ");
        res.redirect("/error");
      } 
    }
    catch (error){
      console.log(error);
      res.redirect("error")
    }
  });

  app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/pages/success.html');
  });
  app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/pages/error.html');
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
