const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/me', auth, (req, res) => {
    res.status(200).send({ message: 'Getting me' })
})

router.post('/', auth, (req, res) => {
    res.status(200).send({ message: 'Adding user' })
})

router.patch('/', auth, (req, res) => {
    res.status(200).send({ message: 'Updating user' })
})

router.delete('/', auth, (req, res) => {
    res.status(200).send({ message: 'Deleting user' })
})

module.exports = router