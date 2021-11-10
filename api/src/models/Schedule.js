const mongoose = require('mongoose');

const scheduleEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    location: String,
    start: {
        type: Number,
        required: true,
        min: 0,
        max: 1440
    },
    end: {
        type: Number,
        min: 0,
        max: 1440
    }
}, {
    timestamps: true,
    strict: 'throw'
});

scheduleEventSchema.pre('validate', function(next) {
    if (this.start >= this.end) {
        this.invalidate('end', 'Ending time must be greater than starting time', this.end);
    } 

    next();
});

const scheduleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    name: String,
    location: String,
    scheduleEvents: [scheduleEventSchema],
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

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;