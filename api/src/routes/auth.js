const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/login', auth, (req, res) => {
    res.status(200).send({ message: 'Logging out' })
})

router.post('/logout', auth, (req, res) => {
    res.status(200).send({ message: 'Logging in' })
})

module.exports = router