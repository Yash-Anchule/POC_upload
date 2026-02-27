const mongoose = require('mongoose');

const pocSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        techStack: {
            type: [String],
            default: [],
        },
        demoLink: {
            type: String,
            trim: true,
            default: '',
        },
        repoLink: {
            type: String,
            trim: true,
            default: '',
        },
        thumbnail: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required'],
        },
    },
    {
        timestamps: true,
    }
);

pocSchema.index({ status: 1 });
pocSchema.index({ author: 1 });
pocSchema.index({ techStack: 1 });
pocSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Poc', pocSchema);
