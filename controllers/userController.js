const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: { users }
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Cannot update password using this route', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findOne();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: { user }
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
