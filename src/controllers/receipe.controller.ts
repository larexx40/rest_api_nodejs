// src/controllers/receipe.controller.ts

import { Request, Response } from 'express';
import RecipeModel from '../models/receipe.model';
import { validationResult } from 'express-validator';

export const getRecipes = async (req: Request, res: Response): Promise<any> => {
    try {
        const recipes = await RecipeModel.find(); // Fetch all recipes
        return res.status(200).json({ 
            success: true,
            message: "Receipes fetched successfully", 
            data: recipes 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export const getRecipeById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
        const recipe = await RecipeModel.findById(id);
        if (!recipe) {
            return res.status(404).json({ 
                success: false, 
                message: 'Recipe not found' ,
                errors:[]
            });
        }
        return res.status(200).json({ 
            success: true,
            message:"Receipe data fetched", 
            data: recipe 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export const createRecipe = async (req: Request, res: Response): Promise<any> => {

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errorMessages = validationErrors.array().map(err => ({
          field: err.type,
          message: err.msg,
        }));
        return res.status(400).json({ 
            success: false, 
            message:"Invalid data passed", 
            errors: errorMessages 
        });
    }
    const { title, ingredients, instructions } = req.body;
    try {
        const newRecipe = new RecipeModel({ title, ingredients, instructions });
        await newRecipe.save();
        return res.status(201).json({
            success: true, 
            message:"Invalid data passed", 
            data: newRecipe 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};


export const updateRecipe = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
    try {
        const updatedRecipe = await RecipeModel.findByIdAndUpdate(id, { title, ingredients, instructions }, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ 
                success: false, 
                message: 'Recipe not found' ,
                errors:[]
            });
        }
        return res.status(200).json({ 
            success: true, 
            message:"Receipe updated successfully", 
            data: updatedRecipe 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};


export const deleteRecipe = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
        const deletedRecipe = await RecipeModel.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).json({ 
                success: false, 
                message: 'Recipe not found',
                errors:[]
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Recipe deleted successfully' });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};
