const mongoose = require('mongoose');

const portalSourceSchema = new mongoose.Schema(
  {
    portal: {
      type: String,
      required: true,
      enum: [
        'Direct Company',
        'LinkedIn',
        'Naukri',
        'Indeed',
        'Apna',
        'Govt NCS',
        'Foundit',
        'Glassdoor',
        'Internshala',
        'Unstop',
        'Other'
      ],
      default: 'Direct Company'
    },
    url: {
      type: String,
      required: true
    },
    externalJobId: {
      type: String,
      default: null
    },
    postedAt: {
      type: Date,
      default: Date.now
    },
    isDirect: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },
    qualification: {
      type: [String],
      required: true,
      enum: [
        '10th Pass',
        '12th / Inter',
        'Diploma / ITI',
        'Any Graduate',
        'B.Tech / B.E',
        'Post Graduate'
      ],
      default: ['Any Graduate']
    },
    experienceMin: {
      type: Number,
      default: 0
    },
    experienceMax: {
      type: Number,
      default: 5
    },
    salaryMin: {
      type: Number,
      default: 0
    },
    salaryMax: {
      type: Number,
      default: 0
    },
    salaryDisplay: {
      type: String,
      default: 'Best in Industry'
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
        default: 'Bengaluru'
      },
      state: {
        type: String,
        trim: true,
        default: 'Karnataka'
      },
      isRemote: {
        type: Boolean,
        default: false
      }
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time'
    },
    openingsCount: {
      type: Number,
      default: 1
    },
    skills: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    sources: {
      type: [portalSourceSchema],
      validate: [(val) => val.length > 0, 'Job must have at least one portal source']
    },
    dedupHash: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'DRAFT'],
      default: 'ACTIVE'
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    postedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound and text indexes for rapid search
jobSchema.index({ status: 1, postedAt: -1 });
jobSchema.index({ qualification: 1 });
jobSchema.index({ 'location.city': 1 });
jobSchema.index({ 'location.isRemote': 1 });
jobSchema.index({ 'sources.portal': 1 });
jobSchema.index({ companyName: 1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });

// Full text search index
jobSchema.index({
  title: 'text',
  companyName: 'text',
  description: 'text',
  skills: 'text',
  'location.city': 'text'
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
