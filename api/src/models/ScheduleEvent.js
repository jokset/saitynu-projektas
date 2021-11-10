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
        validate(value) {
            if (!(value >= 0 && value < 1440)) {
                throw new Error('Starting time is invalid');
            }
        }
    },
    end: {
        type: Number,
        validate(value) {
            if (!(value >= 0 && value < 1440)) {
                throw new Error('Ending time is invalid');
            }
        }
    }
}, {
    timestamps: true,
    strict: 'throw'
});

scheduleEventSchema.pre('validate', function(next) {
    if (this.start >= this.end) {
        next(new Error('Ending time must be greater than starting time'));
    } else {
        next();
    }
});

const ScheduleEvent = mongoose.model('ScheduleEvent', scheduleEventSchema);

module.exports = ScheduleEvent;