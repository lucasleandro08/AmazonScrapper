/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  const errorResponse = {
    error: 'Internal Server Error',
    message: 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  if (err.name === 'ValidationError') {
    errorResponse.error = 'Validation Error';
    errorResponse.message = err.message;
    return res.status(400).json(errorResponse);
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    errorResponse.error = 'Network Error';
    errorResponse.message = 'Failed to connect to Amazon. Please try again later.';
    return res.status(503).json(errorResponse);
  }

  res.status(500).json(errorResponse);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
