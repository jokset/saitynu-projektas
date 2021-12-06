const express = require('express')
const { auth, isAdmin } = require('../middleware/auth')
const Event = require('../models/event')
const Task = require('../models/task')
const Schedule = require('../models/schedule')
const router = new express.Router()
const { Error } = require('mongoose')

router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const events = await Event.find({ owner: req.user._id });
        return res.status(200).send(events);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findOne({ owner: req.user._id, _id: req.params.id }).populate('organizers');
        return res.status(200).send(event);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.post('/', [auth, isAdmin], async (req, res) => {
    try {
        const event = new Event({ ...req.body, owner: req.user._id });
        await event.save();
        return res.status(201).send(event);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.patch('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, 
            req.body, { new: true, runValidators: true });
        if (!event) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(event);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        await Task.deleteMany({ event: event._id });
        await Schedule.deleteMany({ event: event._id });
        if (!event) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(event);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.post('/:id/organizers', [auth, isAdmin], async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, 
            { $addToSet: { organizers: req.body.id } }, { new: true, runValidators: true }).populate('organizers');
        if (!event) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(event);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.delete('/:id/organizers/:userId', [auth, isAdmin], async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, 
            { $pull: { organizers: req.params.userId } }, { new: true, runValidators: true }).populate('organizers');
        if (!event) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(event);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.get('/:id/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ event: req.params.id }).populate('assignees');
        return res.status(200).send(tasks);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

module.exports = router