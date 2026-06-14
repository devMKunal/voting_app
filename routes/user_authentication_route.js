const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Candidate = require('../models/candidate');
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const { asyncHandler } = require('../middleware/errorHandler');


router.post('/signup', asyncHandler(async (req, res) => {
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
}))

router.post('/login', asyncHandler(async (req, res) => {
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
}))

router.get('/allUsers', jwtAuthMiddleware, asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({ users: users });
}))



module.exports = router;