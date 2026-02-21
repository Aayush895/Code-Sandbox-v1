/* eslint-disable no-unused-vars */
export const errorHandler = (err, _, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};
