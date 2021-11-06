const express = require('express')
const { auth, isAdmin } = require('../middleware/auth')
const Event = require('../models/Event')
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

router.post('/', [auth, isAdmin], async (req, res) => {
    try {
        const event = new Event(req.body);
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
        const event = await Event.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!event) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(event);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id });
        if (!event) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(event);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

module.exports = router