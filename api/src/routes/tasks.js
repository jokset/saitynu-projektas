const express = require('express')
const { auth, isAdmin } = require('../middleware/auth')
const Task = require('../models/task')
const router = new express.Router()
const { Error } = require('mongoose')

router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const tasks = await Task.find({}).populate(['assignees', 'owner']);
        return res.status(200).send(tasks);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, $or: [
            {assignee: req.user._id}, {owner: req.user._id}
        ]});

        if (!task) return res.status(404).send({ error: true, message: "Resource not found" });

        return res.status(200).send(task);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, owner: req.user._id });
        await task.save();
        return res.status(201).send(task);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.patch('/:id', auth, async (req, res) => {
    try {
        const admin = (await req.user.populate('role')).role.name === 'Admin';

        const task = admin ? 
        await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        :
        await Task.findOneAndUpdate({ _id: req.params.id, $or: [
            {assignees: req.user._id}, {owner: req.user._id}
        ]}, req.body, { new: true, runValidators: true });

        if (!task) return res.status(404).send({ error: true, message: "Resource not found" });

        else return res.status(200).send(task);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const admin = (await req.user.populate('role')).role.name === 'Admin';

        const task = admin ? 
        await Task.findOneAndDelete({ _id: req.params.id })
        :
        await Task.findOneAndDelete({ _id: req.params.id, $or: [
            {assignees: req.user._id}, {owner: req.user._id}
        ]});

        if (!task) return res.status(404).send({ error: true, message: "Resource not found" });
        else return res.status(200).send(task);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.get('/:id/assignees', auth, async (req, res) => {
    try {
        const admin = (await req.user.populate('role')).role.name === 'Admin';

        const assignees = admin ? 
        (await Task.findOne({ _id: req.params.id })).assignees
        :
        (await Task.findOne({ _id: req.params.id, $or: [
            {assignees: req.user._id}, {owner: req.user._id}
        ]})).assignees;

        if (!assignees) 
            return res.status(404).send({ error: true, message: "Resource not found" });

        return res.status(200).send(assignees);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.patch('/:id/assignees', auth, async (req, res) => {
    try {
        const admin = (await req.user.populate('role')).role.name === 'Admin';

        const assignees = admin ? 
        await Task.findOneAndUpdate({ _id: req.params.id },
            { $addToSet: { assignees: req.body.id } }, { new: true, runValidators: true })
        :
        await Task.findOneAndUpdate({ _id: req.params.id, $or: [
            { assignees: req.user._id }, { owner: req.user._id }
        ]}, { $addToSet: { assignees: req.body.id } }, { new: true, runValidators: true });

        if (!assignees) 
            return res.status(404).send({ error: true, message: "Resource not found" });

        return res.status(200).send(assignees);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.delete('/:id/assignees/:userId', auth, async (req, res) => {
    try {
        const admin = (await req.user.populate('role')).role.name === 'Admin';

        const assignees = admin ? 
        await Task.findOneAndUpdate({ _id: req.params.id, assignees: req.params.userId },
            { $pull: { assignees: req.params.userId } },
            { new: true, runValidators: true })
        :
        await Task.findOneAndUpdate({ _id: req.params.id, assignees: req.params.userId, $or: [
            { assignees: req.user._id }, { owner: req.user._id }
        ]}, { $pull: { assignees: req.params.userId } }, { new: true, runValidators: true });

        if (!assignees) 
            return res.status(404).send({ error: true, message: "Resource not found" });

        return res.status(200).send(assignees);
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

module.exports = router