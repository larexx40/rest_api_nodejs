import { body } from 'express-validator';

export const createUserValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

  body('email')
    .isEmail().withMessage('Please enter a valid email address'),

  body('age')
    .isInt({ min: 1, max: 100 }).withMessage('Age must be an integer between 1 and 100'),
];
export const updateUserValidation= [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('age').optional().isNumeric().withMessage('Age is reguired.'),
  body('email').optional().notEmpty().withMessage('Email cannot be empty'),
];