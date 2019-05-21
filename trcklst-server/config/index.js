require('dotenv').config();
const Joi = require('@hapi/joi');

const envVarsSchema = Joi.object().keys({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    PORT: Joi.number()
        .default(4040),
    MONGOOSE_DEBUG: Joi.boolean()
        .when('NODE_ENV', {
            is: Joi.string().equal('development'),
            then: Joi.boolean().default(true),
            otherwise: Joi.boolean().default(false),
        }),  
    JWT_SECRET: Joi.string().required()
        .description('JWT Secret required to sign'),
    JWT_EXPIRES_IN: Joi.number().default(1440)
        .description('JWT expiration time in seconds'),
    MONGO_HOST: Joi.string().required()
        .description('Mongo DB host url'),
    MONGO_PORT: Joi.number()
        .default(27017),
    MONGO_USER: Joi.string().required()
        .description('Mongo user'),
    MONGO_PASS: Joi.string().required()
        .description('Mongo password'),  
    MONGO_DBNAME: Joi.string().required()
        .description('Mongo db name'),     
    SPOTIFY_CLIENT_ID: Joi.string().required()
        .description('Spotify client id for auth'),
    SPOTIFY_CLIENT_SECRET: Joi.string().required()
        .description('Spotify client secret for auth'),
    SPOTIFY_REDIRECT_URL: Joi.string().required()
        .description('redirection url after spotify auth'),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiresIn: envVars.JWT_EXPIRES_IN,
    mongo: {
        host: envVars.MONGO_HOST,
        port: envVars.MONGO_PORT,
        user: envVars.MONGO_USER,
        pass: envVars.MONGO_PASS,
        dbName: envVars.MONGO_DBNAME
    },
    spotify: {
        clientId: envVars.SPOTIFY_CLIENT_ID,
        clientSecret: envVars.SPOTIFY_CLIENT_SECRET,
        redirectUrl: envVars.SPOTIFY_REDIRECT_URL,
    },
};

module.exports = config;
