const jwt = require('jsonwebtoken');
const User = require('../models/user')
const { TokenExpiredError } = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        var token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : undefined;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user)
            return res.status(401).send({error: true, message: "User not found"});

        req.token = token;
        req.user = user;
        next()
    } catch (e) {
        if (e instanceof TokenExpiredError)
            return res.status(401).send({error: true, message: "Access token has expired"});
        else
            return res.status(500).send({error: true, message: e.message});
    }
}

module.exports = auth