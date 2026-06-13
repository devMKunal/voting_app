const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/profile', async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(user);
        res.status(200).json({ user: user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/profile/password', async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        const { currentPassword, newPassword } = req.body;

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();

        console.log('Password updated successfully');
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;