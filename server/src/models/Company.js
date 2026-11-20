const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      default: 'Information Technology'
    },
    headquarters: {
      type: String,
      default: 'Bengaluru, India'
    },
    website: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    gstOrCin: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

companySchema.index({ isVerified: 1 });

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
