const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require('../models/User');
const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'ADMIN']).default('CANDIDATE'),
  qualification: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const register = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, 'Validation failed', validation.error.issues.map((i) => i.message));
  }

  const { name, email, password, role, qualification, city, phone } = validation.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || 'CANDIDATE',
    qualification: qualification || 'Any Graduate',
    city: city || 'Bengaluru',
    phone: phone || ''
  });

  const token = user.generateAuthToken();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          qualification: user.qualification,
          city: user.city,
          phone: user.phone,
          skills: user.skills,
          resumeUrl: user.resumeUrl
        },
        token
      },
      'Registration successful'
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, 'Validation failed', validation.error.issues.map((i) => i.message));
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  const token = user.generateAuthToken();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          qualification: user.qualification,
          city: user.city,
          phone: user.phone,
          skills: user.skills,
          resumeUrl: user.resumeUrl,
          savedJobsCount: user.savedJobs.length
        },
        token
      },
      'Login successful'
    )
  );
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash').populate('savedJobs');
  const appliedCount = await Application.countDocuments({ candidateId: user._id });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        stats: {
          appliedCount,
          savedCount: user.savedJobs ? user.savedJobs.length : 0
        }
      },
      'User profile retrieved successfully'
    )
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, city, qualification, skills, resumeUrl } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (city) updates.city = city;
  if (qualification) updates.qualification = qualification;
  if (skills && Array.isArray(skills)) updates.skills = skills;
  if (resumeUrl !== undefined) updates.resumeUrl = resumeUrl;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-passwordHash');

  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

const socialAuth = asyncHandler(async (req, res) => {
  const { provider = 'GOOGLE', email, name, avatar = '', role = 'CANDIDATE', socialId = '' } = req.body;

  if (!email || !name) {
    throw new ApiError(400, 'Email and Name are required for social authentication.');
  }

  const validProviders = ['GOOGLE', 'FACEBOOK', 'LINKEDIN'];
  const normalizedProvider = validProviders.includes(provider?.toUpperCase()) ? provider.toUpperCase() : 'GOOGLE';

  let user = await User.findOne({ email });

  if (!user) {
    // Generate secure random fallback passwordHash for social user
    const randomPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(randomPassword, salt);

    user = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'CANDIDATE',
      authProvider: normalizedProvider,
      avatar,
      socialId,
      city: 'Bengaluru',
      qualification: 'Any Graduate'
    });
  } else {
    if (avatar && !user.avatar) user.avatar = avatar;
    if (socialId && !user.socialId) user.socialId = socialId;
    if (user.authProvider === 'LOCAL') user.authProvider = normalizedProvider;
    await user.save();
  }

  const token = user.generateAuthToken();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          authProvider: user.authProvider || normalizedProvider,
          avatar: user.avatar || avatar,
          qualification: user.qualification,
          city: user.city,
          phone: user.phone,
          skills: user.skills,
          resumeUrl: user.resumeUrl,
          savedJobsCount: user.savedJobs ? user.savedJobs.length : 0
        },
        token
      },
      `Successfully authenticated with ${normalizedProvider}`
    )
  );
});

module.exports = {
  register,
  login,
  socialAuth,
  getMe,
  updateProfile
};
