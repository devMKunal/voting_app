const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { jwtAuthMiddleware } = require('./jwt');

const userAuthenticationRoutes = require('./routes/user_authentication_route');
app.use('/', userAuthenticationRoutes);

const profileRoutes = require('./routes/user_profile_route');
app.use('/user', jwtAuthMiddleware, profileRoutes);

const candidateRoutes = require('./routes/candidate_management_route');
app.use('/candidate', jwtAuthMiddleware, candidateRoutes);

const votingRoutes = require('./routes/voting_route');
app.use('/vote', jwtAuthMiddleware, votingRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
})