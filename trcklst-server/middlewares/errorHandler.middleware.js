const httpStatus = require('http-status');
const { env } = require('../config');

const errorHandler = (err, req, res, next) => {
    res.status(err.status).send({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: env === 'development' ? err.stack : {},
    });
};

module.exports = errorHandler;