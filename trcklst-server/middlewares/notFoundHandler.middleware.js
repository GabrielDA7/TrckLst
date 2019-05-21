const APIError = require('../libs/apiError');
const { NOT_FOUND } = require('http-status');

const notFoundHandler = (req, res, next) => {
    const err = new APIError('API Not Found', NOT_FOUND, true);
    return next(err);
};

module.exports = notFoundHandler;