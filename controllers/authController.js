const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};

const signToken = id => {
    return jwt.sign(
        { id: id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
}

exports.sigup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'sucess',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1| check if email and password exist
    if (!email || !password) {
        return next(
            new AppError(
                'please provide email and password',
                400
            )
        );
    }
    
    // 2| check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (
        !user ||
        !(await user.correctPassword(
            password,
            user.password
        ))
    ) {
        return next(
            new AppError('incorect email or password', 401)
        );
    }

    // 3| if everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'sucess',
        token
    });
});

