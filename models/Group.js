const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  people: [{
    name:{
      type: String,
      required: true
    },
    email:{
      type: String
    }
  }]

});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;