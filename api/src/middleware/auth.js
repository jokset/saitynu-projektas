const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const { TokenExpiredError } = require('jsonwebtoken');
const Event = require('../models/Event');

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

const isAdmin = async (req, res, next) => {
    const role = await Role.findOne({ _id: req.user.role });
    if (!role) throw new Error("User has no role");
        
    if (role.name !== "Admin")
        return res.status(401).send();
    else
        next();
}

const isOrganizer = async (req, res, next) => {
    const role = await Role.findOne({ _id: req.user.role });
    if (!role) throw new Error("User has no role");
        
    if (role.name !== "Organizer")
        return res.status(401).send();
    else
        next();
}

const isPermittedToEvent = async (req, eventId) => {
    const event = await Event.findOne({ _id: eventId })
    return event.owner == req.user.id || event.organizers.includes(req.user.id)
}

module.exports = {auth, isAdmin, isOrganizer, isPermittedToEvent}