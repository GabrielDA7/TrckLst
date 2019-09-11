const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const sockets = require('./sockets')(io);

const { CLIENT_URL } = require('./constantes/client.constantes');
const { json, urlencoded } = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { env } = require('./config');
const { errorConverter, notFoundHandler, errorHandler } = require('./middlewares');


if (env === 'development') {
  app.use(logger('dev'));
}

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
  origin:[CLIENT_URL],
  methods:['GET','POST'],
  credentials: true
}));

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use(errorConverter);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler, send stacktrace only during development
app.use(errorHandler);

module.exports = server;
