const User = require('./../models/userModel');

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
     const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        mensage: 'this route is not defined',
    });
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        mensage: 'this route is not defined',
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        mensage: 'this route is not defined',
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        mensage: 'this route is not defined',
    });
};
