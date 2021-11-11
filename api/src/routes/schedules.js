const express = require('express')
const { auth, isAdmin, isPermittedToEvent } = require('../middleware/auth')
const router = new express.Router()
const { Error } = require('mongoose')
const Schedule = require('../models/Schedule')

router.post('/:scheduleId/items', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.scheduleId });
        
        if (schedule && (await isPermittedToEvent(req, schedule.event)))
            schedule.scheduleEvents.push(req.body)
        else 
            return res.status(404).send({ error: true, message: "Resource not found" })
        
        await schedule.save();
        return res.status(201).send(schedule.scheduleEvents.at(-1))
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.get('/:scheduleId/items/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.scheduleId, "scheduleEvents._id": req.params.id });
        if (schedule && (await isPermittedToEvent(req, schedule.event)))
            return res.status(200).send(schedule.scheduleEvents.find(e => e._id.toString() === req.params.id));
        else 
            return res.status(404).send({ error: true, message: "Resource not found" })
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.patch('/:scheduleId/items/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.scheduleId });
        const scheduleEventIdx = schedule.scheduleEvents.findIndex(e => e._id.toString() === req.params.id);
        
        if (schedule && scheduleEventIdx !== -1 && (await isPermittedToEvent(req, schedule.event))) {
            if (req.body.name) schedule.scheduleEvents[scheduleEventIdx].name = req.body.name;
            if (req.body.start) schedule.scheduleEvents[scheduleEventIdx].start = req.body.start;
            if (req.body.end) schedule.scheduleEvents[scheduleEventIdx].end = req.body.end;
            if (req.body.location) schedule.scheduleEvents[scheduleEventIdx].location = req.body.location;
            if (req.body.description) schedule.scheduleEvents[scheduleEventIdx].description = req.body.description;
            schedule.scheduleEvents[scheduleEventIdx].updatedAt = Date.now();
        }            
        else 
            return res.status(404).send({ error: true, message: "Resource not found" })
        
        schedule.markModified('scheduleEvents');
        await schedule.save();
        return res.status(200).send(schedule.scheduleEvents[scheduleEventIdx]);
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.delete('/:scheduleId/items/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.scheduleId, "scheduleEvents._id": req.params.id });
        
        if (schedule && (await isPermittedToEvent(req, schedule.event))) {
            const deleted = await Schedule.findOneAndUpdate({ _id: req.params.scheduleId }, 
                { $pull: { scheduleEvents: { _id: req.params.id } } }, { new: true, runValidators: true }); 
            return deleted ? res.status(200).send() : res.status(404).send();
        }
        else 
            return res.status(404).send({ error: true, message: "Resource not found" })
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const schedules = await Schedule.find({}).populate('event');

        return res.status(200).send(schedules.filter(s => s.event.owner.toString() === req.user.id));
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.id });
        if ((await isPermittedToEvent(req, schedule.event)))
            return res.status(201).send(schedule);
        else 
            return res.status(404).send({ error: true, message: "Resource not found" })
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message });
        else
            return res.status(500).send({ error: true, message: e.message });
    }
})

router.post('/', auth, async (req, res) => {
    try {
        if (!(await isPermittedToEvent(req, req.body.event)))
            throw new Error("Invalid Event ID");

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

router.patch('/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.id });

        if (!schedule || !isPermittedToEvent(req, schedule.event))
            return res.status(404).send({ error: true, message: "Resource not found" })
        else {
            const updated = await Schedule.findOneAndUpdate({ _id: req.params.id }, 
                req.body, { new: true, runValidators: true });
            return res.status(200).send(updated);
        }
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.id });

        if (!schedule || !isPermittedToEvent(req, schedule.event))
            return res.status(404).send({ error: true, message: "Resource not found" })
        else {
            const deleted = await Schedule.findOneAndDelete({ _id: req.params.id });
            return res.status(200).send(deleted);
        }
    } catch (e) {
        if (e instanceof Error.ValidationError)
            return res.status(400).send({ error: true, message: e.message })
        else
            return res.status(500).send({ error: true, message: e.message })
    }
})

module.exports = router