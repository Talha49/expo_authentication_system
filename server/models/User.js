const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  contact: { type: String, required: true, unique: true }, // User's contact number, must be unique
  city: { type: String, required: true }, // User's city
  fullName: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // User's email, must be unique
  password: { type: String, required: true }, // Hashed password
  isVerified: { type: Boolean, default: false }, // Tracks if email is verified via OTP
  otp: { type: String }, // Stores the OTP for signup/forgot password
  otpExpiry: { type: Date }, // Expiration time for OTP
  token: { type: String }, // Stores JWT for session validation
});

module.exports = mongoose.model('User', userSchema);