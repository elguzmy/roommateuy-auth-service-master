const createError = (settings, implementationContext = createError)  => new AppError({ settings, implementationContext });

const errorType = {
    APPLICATION: 'APPLICATION',
    DB: 'DB'
};

class AppError extends Error {
    constructor ({ settings = {}, implementationContext }) {
        super();

        if (settings.type !== errorType.DB && settings.type !== errorType.APPLICATION) {
            this.type = errorType.APPLICATION;
        } else {
            this.type = settings.type;
        }

        this.message = settings.message || 'Unexpected Error';
        this.errorCode = settings.errorCode || 'ERR_UNEXPECTED_ERROR';
        this.statusCode = settings.statusCode || 500;

        Error.captureStackTrace(this, (implementationContext || createError));
    }
}

/**
 * Generics
 */

const missingParam = ({ message, param = '', type = errorType.APPLICATION } = {}) => createError({
    message: message || `Missing parameter ${param}`,
    errorCode: 'ERR_MISSING_PARAM',
    statusCode: 400,
    type,
}, missingParam);

const notFound = ({ message = 'Not Found', type = errorType.APPLICATION } = {}) => createError({
    message,
    errorCode: 'ERR_NOT_FOUND',
    statusCode: 404,
    type,
}, notFound);

const internalError = ({ message = 'Internal Error' } = {}) => createError({
    message,
    errorCode: 'ERR_INTERNAL_ERROR',

}, internalError);

const dbError = err => {
    const settings = {};

    settings.message = err.message;
    settings.statusCode = 500;
    settings.errorCode = err.name;
    settings.type = errorType.DB;

    return createError(settings, dbError);
};

const error = ({ message = 'Unknown Error', errorCode = 'ERR_UNKNOWN_ERROR', statusCode = 500, type = errorType.APPLICATION } = {}) => createError({
    message,
    errorCode,
    statusCode,
    type,
}, error);

module.exports = {
    missingParam,
    notFound,
    internalError,
    dbError,
    error,
    errorType,
};
