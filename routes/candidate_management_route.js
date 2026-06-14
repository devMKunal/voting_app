const express = require('express');
const router = express.Router();

const Candidate = require('../models/candidate');
const User = require('../models/user');
const { asyncHandler } = require('../middleware/errorHandler');

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user.role === 'admin';
    } catch (err) {
        return false;
    }
}

router.post('/', asyncHandler(async (req, res) => {
    const isAdmin = await checkAdminRole(req.user.id);
    if (!isAdmin) {
        return res.status(403).json({ error: 'User is not an admin' });
    }

    const data = req.body;
    const newCandidate = new Candidate(data);

    const response = await newCandidate.save();
    console.log('Candidate created: ', response);
    res.status(200).json({ response: response });
}))

router.put('/:candidateId', asyncHandler(async (req, res) => {
    const isAdmin = await checkAdminRole(req.user.id);
    if (!isAdmin) {
        return res.status(403).json({ error: 'User is not an admin' });
    }

    const candidateId = req.params.candidateId;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
    }

    const data = req.body;
    const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, data, {
        new: true, // Return the updated document
        runValidators: true, // Run mongoose validations
    });

    console.log('Candidate data updated: ', updatedCandidate);
    res.status(200).json({ response: updatedCandidate });
}))

router.delete('/:candidateId', asyncHandler(async (req, res) => {
    const isAdmin = await checkAdminRole(req.user.id);
    if (!isAdmin) {
        return res.status(403).json({ error: 'User is not an admin' });
    }

    const candidateId = req.params.candidateId;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
    }

    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
    console.log('Candidate deleted: ', deletedCandidate);
    res.status(200).json({ response: deletedCandidate });
}))

module.exports = router;