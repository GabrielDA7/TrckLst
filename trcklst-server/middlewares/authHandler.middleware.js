const authHandler = (req, res, next) => {
    const authorization = req.header('authorization');
    res.locals.session = JSON.parse(Buffer.from((authorization.split(' ')[1]).split('.')[1], 'base64').toString());
    return next();
};

module.exports = authHandler;