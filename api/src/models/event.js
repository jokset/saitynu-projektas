const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: String,
    description: String,
    capacity: {
        type: Number,
        required: true,
        validate(value) {
            if (value <= 0 || !Number.isInteger(value)) {
                throw new Error('Capacity must be a positive integer')
            }
        }
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    },
    organizers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    }
}, {
    timestamps: true,
    strict: 'throw'
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;