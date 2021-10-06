const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/', auth, (req, res) => {
    res.status(200).send({ message: 'Getting schedule' })
})

router.post('/', auth, (req, res) => {
    res.status(200).send({ message: 'Adding schedule' })
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