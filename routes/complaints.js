const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
});


complaintSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('User').updateOne(
            { _id: this.createdBy },
            { $pull: { complaints: this._id } }
        );
        next();
    } catch (error) {
        next(error);
    }
});



module.exports = mongoose.model('Complaint', complaintSchema);
