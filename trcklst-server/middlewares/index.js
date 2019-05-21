const errorConverter = require('./errorConverter.middleware');
const errorHandler = require('./errorHandler.middleware');
const notFoundHandler = require('./notFoundHandler.middleware');
const authHandler = require('./authHandler.middleware');

module.exports = {
    errorConverter,
    errorHandler,
    notFoundHandler,
    authHandler
}