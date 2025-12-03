const morgan = require('morgan');

const logger = (app) => {
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
};

module.exports = logger;
