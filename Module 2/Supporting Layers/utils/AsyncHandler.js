// Wraps an async route handler so rejected promises reach the error middleware.
// No imports needed — it is a higher-order function over plain callbacks.
module.exports = (fn) => (req, res, next) => {
return Promise.resolve(fn(req, res, next)).catch(next);
};