const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/', auth, (req, res) => {
    res.status(200).send({ message: 'Getting task' })
})

router.post('/', auth, (req, res) => {
    res.status(200).send({ message: 'Adding task' })
})

router.patch('/', auth, (req, res) => {
    res.status(200).send({ message: 'Updating task' })
})

router.delete('/', auth, (req, res) => {
    res.status(200).send({ message: 'Deleting task' })
})

router.get('/assignees', auth, (req, res) => {
    res.status(200).send({ message: 'Getting assignees' })
})

router.post('/assign', auth, (req, res) => {
    res.status(200).send({ message: 'Assigning task to an organizer' })
})

router.delete('/assignees', auth, (req, res) => {
    res.status(200).send({ message: 'Deleting assignee' })
})

module.exports = router