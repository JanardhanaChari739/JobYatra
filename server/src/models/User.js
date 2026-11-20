const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['CANDIDATE', 'EMPLOYER', 'ADMIN'],
      default: 'CANDIDATE'
    },
    authProvider: {
      type: String,
      enum: ['LOCAL', 'GOOGLE', 'FACEBOOK', 'LINKEDIN'],
      default: 'LOCAL'
    },
    avatar: {
      type: String,
      default: ''
    },
    socialId: {
      type: String,
      default: ''
    },
    qualification: {
      type: String,
      enum: [
        '10th Pass',
        '12th / Inter',
        'Diploma / ITI',
        'Any Graduate',
        'B.Tech / B.E',
        'Post Graduate',
        'Other'
      ],
      default: 'Any Graduate'
    },
    city: {
      type: String,
      trim: true,
      default: 'Bengaluru'
    },
    skills: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Method to generate JWT Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET || 'jobyatra_default_jwt_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Exclude passwordHash from JSON transformations
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
