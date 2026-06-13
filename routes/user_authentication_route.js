const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Candidate = require('../models/candidate');
const { jwtAuthMiddleware, generateToken } = require('../jwt');


router.post('/signup', async (req, res) => {
    try {
        /// gather body data from the request
        const data = req.body;
        const newUser = new User(data);

        /// save the user
        const response = await newUser.save();

        const payload = {
            id: response.id,
        }

        /// generate token
        const token = generateToken(payload);

        console.log('User created: ', response);
        res.status(200).json({ response: response, accessToken: token })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;

        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(404).json({ error: 'Invalid credentials'});
        }

        const payload = {
            id: user.id,
        }

        const token = generateToken(payload);

        res.status(200).json({ accessToken: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/allUsers', jwtAuthMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users: users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})



module.exports = router;