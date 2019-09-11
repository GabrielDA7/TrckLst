const errorHandler = (error) => {
    const eventName = getEventName(error);
    console.log('socket error : ', eventName);
}

const getEventName = (error) => {
    return error.message.toLowerCase().replace(" ", "-");
}

module.exports = errorHandler;