import { body, ValidationChain } from 'express-validator';

export const validateRecipe: ValidationChain[] = [
  body('title').notEmpty().withMessage('Title is required'),
  body('ingredients').isArray().withMessage('Ingredients should be an array'),
  body('instructions').notEmpty().withMessage('Instructions are required'),
];