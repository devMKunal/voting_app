const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
};

module.exports = { asyncHandler, errorHandler };
