const express = require('express')
const { auth } = require('../middleware/auth')
const router = new express.Router()

router.get('/', auth, (req, res) => {
    res.status(200).send({ message: 'Getting ticket' })
})

router.post('/', auth, (req, res) => {
    res.status(200).send({ message: 'Adding ticket' })
})

router.patch('/', auth, (req, res) => {
    res.status(200).send({ message: 'Updating ticket' })
})

router.delete('/', auth, (req, res) => {
    res.status(200).send({ message: 'Deleting ticket' })
})

router.get('/analytics', auth, (req, res) => {
    res.status(200).send({ message: 'Getting ticket purchases data' })
})

module.exports = router