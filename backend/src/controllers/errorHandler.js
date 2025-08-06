export const errorHandler = (err, req, res, next ) => {
    console.error('Error occured: ', err);

    //default error structure
    const errorResponse = {
        error: 'internal server error',
        message: 'something went wrong',
    };
    //handle specific error types 
    if(err.name === 'ValidationError'){
        errorResponse.error = 'validation error';
        errorResponse.message = err.message;
        return req.status(400).json(errorResponse);
    }
    if (err.code ==='EECONNREFUSED' || err.code === 'ETIMEDOUT') {
        errorResponse.error = 'Network Error';
        errorResponse.message = 'Failed to connect to Amazon. Please try again later!';
        return req.status(503).json(errorResponse);
    }
    req.status(500).json(errorResponse);
};
  /*
 Async error wrapper to catch async errors automatically
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}