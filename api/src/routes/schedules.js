const express = require('express')
const { auth, isAdmin, isPermittedToEvent } = require('../middleware/auth')
const router = new express.Router()
const { Error } = require('mongoose')
const Schedule = require('../models/Schedule')
const Event = require('../models/Event')

router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const schedules = await Schedule.find({}).populate('event');

        return res.status(200).send(schedules.filter(s => s.event.owner.toString() === req.user.id));
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.id });
        if ((await isPermittedToEvent(req, schedule.event)))
            return res.status(201).send(schedule);
        else 
            return res.status(404).send({ error: true, message: "Resource not found" })
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.post('/', auth, async (req, res) => {
    try {
        if (!(await isPermittedToEvent(req, req.body.event)))
            throw new Error("Invalid Event ID");

        const schedule = new Schedule(req.body);
        await schedule.save();
        return res.status(201).send(schedule);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.patch('/', auth, (req, res) => {
    res.status(200).send({ message: 'Updating schedule' })
})

router.delete('/', auth, (req, res) => {
    res.status(200).send({ message: 'Deleting schedule' })
})

router.get('/item', auth, (req, res) => {
    res.status(200).send({ message: 'Getting schedule item' })
})

router.post('/item', auth, (req, res) => {
    res.status(200).send({ message: 'Adding schedule item' })
})

router.patch('/item', auth, (req, res) => {
    res.status(200).send({ message: 'Updating schedule item' })
})

router.delete('/item', auth, (req, res) => {
    res.status(200).send({ message: 'Deleting schedule item' })
})

module.exports = router