const mongoose = require('mongoose');
const validator = require('validator');

const ticketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        immutable: true
    },
    address: {
        type: String,
        required: true,
        immutable: true
    },
    email: {
        type: String,
        required: true,
        immutable: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        immutable: true
    }
}, {
    timestamps: true,
    strict: 'throw'
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;