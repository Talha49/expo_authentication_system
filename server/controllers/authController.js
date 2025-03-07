const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email'); // Ensure this is imported

exports.signup = async (req, res) => {
  const { contact, city, email, password, fullName } = req.body;
  try {
    if (!contact || !city || !email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP for signup:', otp);

    const user = new User({
      fullName,
      contact,
      city,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });
    await user.save();
    console.log('User saved with OTP:', user.otp);

    try {
      await sendEmail(email, 'Verify Your Account', `Your OTP is: ${otp}`);
      res.status(201).json({ message: 'Signup successful. Check your email for OTP.' });
    } catch (emailError) {
      console.log(`Email failed for ${email}. Use this OTP: ${otp}`);
      res.status(201).json({ 
        message: 'Signup successful. Email failed—check server logs for OTP.' 
      });
    }
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    const token = generateToken(user);
    user.token = token;
    await user.save();

    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: parseInt(process.env.SESSION_EXPIRY) 
    });

    const sessionData = { fullName: user.fullName, email: user.email, contact: user.contact, city: user.city };
    res.cookie('sessionData', JSON.stringify(sessionData), { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: parseInt(process.env.SESSION_EXPIRY) 
    });

    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.isVerified) return res.status(400).json({ error: 'Account not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    user.token = token;
    await user.save();

    const sessionData = { fullName: user.fullName, email: user.email, contact: user.contact, city: user.city };
    res.cookie('sessionData', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.SESSION_EXPIRY),
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.SESSION_EXPIRY),
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, 'Reset Your Password', `Your OTP is: ${otp}`);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const sessionData = req.cookies.sessionData;
    if (!sessionData) return res.status(401).json({ error: 'No session data found' });

    const userData = JSON.parse(sessionData);
    const token = req.headers.authorization?.split(' ')[1] || 'Not available in cookie';
    res.status(200).json({ ...userData, token });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('sessionData');
  res.status(200).json({ message: 'Logout successful' });
};