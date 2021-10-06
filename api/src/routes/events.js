const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/', auth, (req, res) => {
    res.status(200).send({ message: 'Getting event' })
})

router.post('/', auth, (req, res) => {
    res.status(200).send({ message: 'Adding event' })
})

router.patch('/', auth, (req, res) => {
    res.status(200).send({ message: 'Updating event' })
})

router.delete('/', auth, (req, res) => {
    res.status(200).send({ message: 'Deleting event' })
})

module.exports = router