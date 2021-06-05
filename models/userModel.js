const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'cpnfirm your password is required'],
    validate: {
      validator: function(el) {
        return this.password === el;
      },
      message: 'password does not match'
    }
  },
  passwordChagedAt: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function(JWTTimeStamp) {
  if (this.passwordChagedAt) {
    const changedTimestamp = this.passwordChagedAt.getTime();
    console.log(this.passwordChagedAt, JWTTimeStamp);
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
