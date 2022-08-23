const mongoose = require('mongoose')

const DonationSchema = new mongoose.Schema({
  donaitionid: {
    type: String,
    required: true,
  },
  emailid: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  alloted: {
    type: Boolean,
    required: true,
  },
})

const DonationModel = mongoose.model('donation', DonationSchema)
module.exports = DonationModel
