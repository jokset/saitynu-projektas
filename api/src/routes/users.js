const express = require('express')
const { Error } = require('mongoose')
const { auth, isAdmin, isOrganizer } = require('../middleware/auth')
const Event = require('../models/Event')
const router = new express.Router()

router.get('/me', auth, (req, res) => {
    res.status(200).send({ message: 'Getting me' })
})

router.get('/:id', auth, (req, res) => {
    if (req.params.id < 10) {
        res.status(200).send({ message: 'Getting user ' + req.params.id })
    } else if (!Number.isInteger(req.params.id)) {
        res.status(400).send({ message: 'Bad request' })
    } else {
        res.status(404).send({ message: 'User not found' })
    }
})

router.post('/', auth, (req, res) => {
    if (req.body.id < 10) {
        res.status(201).send({ message: 'Adding user ' + req.body.id })
    } else {
        res.status(400).send({ message: 'Missing param id' })
    }
})

router.patch('/', auth, (req, res) => {
    if (req.body.id < 10) {
        res.status(200).send({ message: 'Updating user ' + req.body.id })
    } else {
        res.status(400).send({ message: 'Missing param id' })
    }
})

router.delete('/', auth, (req, res) => {
    if (req.body.id < 10) {
        res.status(201).send({ message: 'Deleting user ' + req.body.id })
    } else {
        res.status(400).send({ message: 'Missing param id' })
    }
})

router.get('/:id/events/organized', auth, async (req, res) => {
    try {
        const events = await Event.find({ organizers: req.params.id });
        return res.status(200).send(events);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.get('/:id/events/owned', [auth, isAdmin], async (req, res) => {
    try {
        const events = await Event.find({ owner: req.params.id === 'me' ? req.user._id : req.params.id });
        return res.status(200).send(events);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.get('/:id/tasks/assigned', auth, async (req, res) => {
    try {
        const tasks = await Event.find({ assignees: req.params.id === 'me' ? req.user._id : req.params.id });
        return res.status(200).send(tasks);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

module.exports = router