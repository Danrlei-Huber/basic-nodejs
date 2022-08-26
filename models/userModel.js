const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a user need a name'],
    },
    email: {
        type: String,
        required: [true, 'a user meed a email'],
        unique: true,
        lowercase: true,
        validate: [
            validator.isEmail,
            'please provade a email valid',
        ],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this only work on CREATE and SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same !!!'
        }
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};



const User = mongoose.model('User', userSchema);

module.exports = User;

