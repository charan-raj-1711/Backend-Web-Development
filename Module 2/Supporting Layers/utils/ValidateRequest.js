const { validationResult } = require('express-validator'); // ← library import only
const AppError = require('./AppError'); // ← sibling utils import is fine
module.exports = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty())
return next(new AppError('Validation failed', 422));
next();
};
