const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: validatePassword
    }
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 30,
    validate: {
      validator: validateName
    }
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 30,
    validate: {
      validator: validateName
    }
  },
  notifyUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

async function validateEmail(value) {
  console.log(value);
  if (!value) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(value)) {
    throw Error('Email not valid')
  }
}

async function validatePassword(value) {
  console.log(value);
  if (!value) {
    throw Error('All fields must be filled')
  }
  if (!validator.isStrongPassword(value)) {
    throw Error('Password not strong enough')
  }
}

async function validateName(value) {
  console.log(value);
  if (!value) {
    throw Error('All fields must be filled')
  }
}

// static signup method
userSchema.statics.signup = async function (email, password, firstName, lastName) {

  // validation
  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash, firstName: firstName, lastName: lastName })

  return user
}

// static login method
userSchema.statics.login = async function (email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

const User = mongoose.model('User', userSchema);

module.exports = User;