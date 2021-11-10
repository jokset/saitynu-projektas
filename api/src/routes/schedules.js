const express = require('express')
const { auth } = require('../middleware/auth')
const router = new express.Router()
const { Error } = require('mongoose')
const Schedule = require('../models/Schedule')

router.get('/', auth, (req, res) => {
    res.status(200).send({ message: 'Getting schedule' })
})

router.post('/', auth, async (req, res) => {
    try {
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