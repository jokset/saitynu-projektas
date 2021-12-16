const express = require('express')
const { Error } = require('mongoose')
const { auth, isAdmin } = require('../middleware/auth')
const Event = require('../models/event')
const User = require('../models/user')
const router = new express.Router()

router.get('/me', auth, (req, res) => {
    res.status(200).send(req.user.populate('role'));
})

router.get('/:id?', [auth, isAdmin], async (req, res) => {
    try {
        var data
        if (req.params.id)
            data = await User.findOne({ _id: req.params.id }).populate('role');
        else
            data = await User.find({}).populate('role');

        if (!data) 
            return res.status(404).send({ error: true, message: "Resource not found" });

        return res.status(200).send(data);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (updates.includes('password') &&
        req.oldPassword != req.user.password) 
        return res.status(400).send({ error: true, message: 'Incorrect old password' });

    if (!isValidOperation) {
        return res.status(400).send({ error: true, message: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();
        return res.status(200).send(req.user);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.patch('/:id', [auth, isAdmin], async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['role'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: true, message: 'Invalid updates!' });
    }

    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(404).send({ error: true, message: "Resource not found" });

        updates.forEach((update) => user[update] = req.body[update])
        await user.save();
        return res.status(200).send(req.user);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });

        if (!user) return res.status(404).send({ error: true, message: "Resource not found" });

        else return res.status(200).send(user);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id/events/organized', auth, async (req, res) => {
    try {
        const events = await Event.find({ organizers: req.params.id });
        return res.status(200).send(events);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id/events/owned', [auth, isAdmin], async (req, res) => {
    try {
        const events = await Event.find({ owner: req.params.id === 'me' ? req.user._id : req.params.id });
        return res.status(200).send(events);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id/tasks/assigned', auth, async (req, res) => {
    try {
        const tasks = await Event.find({ assignees: req.params.id === 'me' ? req.user._id : req.params.id });
        return res.status(200).send(tasks);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

module.exports = router
