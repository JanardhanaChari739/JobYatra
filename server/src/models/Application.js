const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required']
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate ID is required']
    },
    appliedViaPortal: {
      type: String,
      default: 'Direct Company'
    },
    applyType: {
      type: String,
      enum: ['DIRECT', 'EXTERNAL_REDIRECT'],
      default: 'DIRECT'
    },
    status: {
      type: String,
      enum: ['VISITED', 'APPLIED', 'IN_PROGRESS', 'SHORTLISTED', 'SELECTED', 'REJECTED'],
      default: 'APPLIED'
    },
    coverNote: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    candidateName: {
      type: String,
      default: ''
    },
    candidateEmail: {
      type: String,
      default: ''
    },
    candidatePhone: {
      type: String,
      default: ''
    },
    candidateQualification: {
      type: String,
      default: ''
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index({ jobId: 1, candidateId: 1 });
applicationSchema.index({ candidateId: 1, appliedAt: -1 });
applicationSchema.index({ jobId: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
