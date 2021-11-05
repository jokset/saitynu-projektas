const express = require('express')
const auth = require('../middleware/auth')
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

module.exports = router