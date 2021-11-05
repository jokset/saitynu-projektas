const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        token: String,
        expirationDate: Date
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
}, {
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    return userObject;
}

userSchema.methods.generateJWT = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: Number.parseInt(process.env.ACCESS_EXPIRATION) });
    
    return token;
}

userSchema.methods.generateRefreshToken = async function () {
    const token = v4();
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + Number.parseInt(process.env.REFRESH_EXPIRATION));

    this.refreshToken = {
        token,
        expirationDate
    }
    
    await this.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) return undefined;

    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch ? user : undefined;
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)

    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;