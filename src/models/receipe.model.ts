import mongoose, { Document } from 'mongoose';
import { Recipe } from '../types';

export interface IRecipe extends Recipe, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  imageUrl: { type: String, default: '' },
});

const  RecipeModel = mongoose.model<IRecipe>('Recipe', RecipeSchema);
export default RecipeModel;