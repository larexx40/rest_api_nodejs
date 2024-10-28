import { body } from 'express-validator';

export const createRecipeValidation = [
  body('title').notEmpty().withMessage('Title is reguired.'),
  body('ingredients').isArray().withMessage('Ingredients should be an array'),
  body('instructions').notEmpty().withMessage('Instructions is required.'),
  body('image').optional().isString().withMessage('Image must be a valid URL.'),
];
export const validateUpdateRecipe= [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('ingredients').optional().isArray().withMessage('Ingredients should be an array'),
  body('instructions').optional().notEmpty().withMessage('Instructions cannot be empty'),
];