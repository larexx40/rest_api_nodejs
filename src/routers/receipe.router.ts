import express from 'express';
import { createRecipe, deleteRecipe, getRecipeById, getRecipes, updateRecipe } from '../controllers/receipe.controller';
import { uploadImage } from '../middlewares/upload.middleware';

const receipeRouter = express.Router();

receipeRouter.get('/', getRecipes);
receipeRouter.get('/:id', getRecipeById);
receipeRouter.post('/',uploadImage('image'), createRecipe);
receipeRouter.patch('/:id',uploadImage('image'), updateRecipe);
receipeRouter.delete('/:id', deleteRecipe);

export default receipeRouter;
