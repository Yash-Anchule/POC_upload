const User = require('../models/User');

/**
 * Seeds a default admin user if no admin exists.
 * Run once via: node utils/seedAdmin.js
 */
const seedAdmin = async () => {
    require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
    const mongoose = require('mongoose');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists — skipping seed');
            process.exit(0);
        }

        await User.create({
            name: 'Admin',
            email: 'admin@pocshowcase.com',
            password: 'admin123',
            role: 'admin',
        });

        console.log('Default admin created: admin@pocshowcase.com / admin123');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedAdmin();
