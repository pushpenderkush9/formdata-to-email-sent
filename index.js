const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/formdata').then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  // Mongoose Schema and Model
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
  });
  
  const Form = mongoose.model('Form', formSchema);

  // Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email provider
    auth: {
      user: 'kushsharmaprince@gmail.com',
      pass: 'laxt ixqn khyy jklb', // Use environment variables for security
    },
});


// Route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;
   
    try {
      // Save data to MongoDB
      const newForm = new Form({ name, email, message });
      await newForm.save();
       // Send email
    const mailOptions = {
        from: 'kushsharmaprince@gmail.com',
        to:  email, // Replace with recipient email
        subject: 'New Form Submission',
        text: `You have a new form submission:
  Name: ${name}
  Email: ${email}
  Message: ${message}`,
  
      };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Form submitted successfully');
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('An error occurred');
    }
  });
  
  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });