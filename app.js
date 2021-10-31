const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = express();
const cors = require('cors')

dotenv.config({ path: './.env' })

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true ,useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
// Routes
app.use('/group', require('./routes/group.js'));
app.use('/transaction', require('./routes/transaction.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
