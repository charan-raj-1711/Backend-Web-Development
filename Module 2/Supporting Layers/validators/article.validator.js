const { body } = require('express-validator');

exports.createArticle = [
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('body').notEmpty().isLength({ max: 2000 }),
];

exports.updateArticle = [
    body('title').optional().notEmpty().trim(),
    body('body').optional().isLength({ max: 2000 }),
];