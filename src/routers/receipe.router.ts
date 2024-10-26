import express from 'express';
import { createRecipe, deleteRecipe, getRecipeById, getRecipes, updateRecipe } from '../controllers/receipe.controller';
import { validateRecipe } from '../validations/receipe.validator';

const receipeRouter = express.Router();

receipeRouter.get('/', getRecipes);
receipeRouter.get('/:id', getRecipeById);
receipeRouter.post('/',validateRecipe, createRecipe);
receipeRouter.put('/:id', validateRecipe,updateRecipe);
receipeRouter.delete('/:id', deleteRecipe);

export default receipeRouter;
