const express = require('express');
const router = express.Router();


const Candidate = require('../models/candidate');
const User = require('../models/user');

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user.role === 'admin';
    } catch (err) {
        return false;
    }
}

router.get('/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json({ candidates: candidates });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/:candidateId', async (req, res) => {
    /// No admin can vote
    /// User can only vote once
    try {
        const isAdmin = await checkAdminRole(req.user.id);
        if (isAdmin) {
            return res.status(403).json({ error: 'User is an admin, hence cannot vote' });
        }
        const candidateId = req.params.candidateId;
        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVoted) {
            return res.status(401).json({ error: 'User has already voted' });
        }

        user.isVoted = true;
        await user.save();

        candidate.votes.push({ user: userId });
        candidate.voteCount += 1;
        await candidate.save();

        res.status(200).json({ message: 'Vote cast successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/counts', async (req, res) => {
    try {
        /// Find all the candidates and sort them based on their vote count
        const candidates = await Candidate.find().sort({ voteCount: 'desc'});

        /// Map the candidates to only return their name and vote counts
        const record = candidates.map((candidate) => {
            return {
                party: candidate.party,
                count: candidate.voteCount
            }
        })

        return res.status(200).json({ voteRecord: record });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;