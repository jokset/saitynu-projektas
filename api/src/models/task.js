const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    state: {
        type: String,
        required: true,
        default: 'todo',
        enum: ['todo', 'inprogress', 'done']
    },
    deadline: {
        type: Date
    },
    finishedOn: {
        type: Date
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        immutable: true
    },
    assignees: [{
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

taskSchema.pre('save', async function (next) {
    if (this.isModified('state') && this.state === 'done')
        this.finishedOn = new Date();
    else if (this.isModified('state') && this.state !== 'done')
        this.finishedOn = undefined;

    next()
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;