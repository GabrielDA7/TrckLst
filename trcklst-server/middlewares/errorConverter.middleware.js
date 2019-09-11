const APIError = require('../libs/apiError');
const { ValidationError } = require('express-validation');

const errorConverter = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
    }

    if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status || err.statusCode, err.name === 'UnauthorizedError' ? true : err.isPublic);
        return next(apiError);
    }

    return next(err);
};

module.exports = errorConverter;