const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const Ticket = require('../models/ticket');
const router = new express.Router();
const { Error } = require('mongoose');

router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const tickets = await Ticket.find({});
        return res.status(200).send(tickets);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.id });

        if (!ticket) return res.status(404).send({ error: true, message: "Resource not found" });

        return res.status(200).send(ticket);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const task = new Ticket({ ...req.body });
        await task.save();
        return res.status(201).send(task);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const deleted = await Ticket.findOneAndDelete({ _id: req.params.id });

        if (!deleted) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(deleted);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

module.exports = router