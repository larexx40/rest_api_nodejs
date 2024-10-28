// src/controllers/receipe.controller.ts

import { NextFunction, Request, Response } from 'express';
import RecipeModel from '../models/receipe.model';
import { validationResult } from 'express-validator';
import { ApiError } from '../middlewares/error.middlware';
import mongoose from 'mongoose';
import { createRecipeValidation, validateUpdateRecipe } from '../validations/receipe.validator';

export const getRecipes = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page as string) || 1; 
        const limit = parseInt(req.query.limit as string) || 10; 

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch recipes with pagination
        const recipes = await RecipeModel.find().skip(skip).limit(limit); 

        // Count total recipes for calculating total pages
        const totalRecipes = await RecipeModel.countDocuments();
        const totalPages = Math.ceil(totalRecipes / limit)

        //format image url
        const baseUrl = `${req.protocol}://${req.get('host')}/uploads`; // Dynamically get the base URL

        const recipesWithImageUrls = recipes.map(recipe => ({
            ...recipe.toObject(),
            imageUrl: recipe.imageUrl ? `${baseUrl}/${recipe.imageUrl}` : null
        }));

        return res.status(200).json({ 
            success: true,
            message: "Receipes fetched successfully", 
            data: {
                recipes:  recipesWithImageUrls,
                pagination: {
                    page,
                    perPage: limit,
                    totalPages,
                    totalData: totalRecipes
                }
            } 
        });
    } catch (error) {
        next(new ApiError(500, 'Server error'));
    }
};

export const getRecipeById = async (req: Request, res: Response ,next: NextFunction): Promise<any> => {
    console.log("@ grtbyid")
    const { id } = req.params;
    try {
        console.log("ID:", id)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid ID format', 'The provided ID is not a valid MongoDB ObjectId');
        }
        const recipe = await RecipeModel.findById(id);
        console.log("Receipe: ", recipe)
        if (!recipe) {
            console.log("Receipe with ID not found", id);
            
            throw new ApiError(404, 'Recipe not found', []);
        }
        //format image url
        const baseUrl = `${req.protocol}://${req.get('host')}/uploads`; // Dynamically get the base URL
        const formattedRecipe = {
            ...recipe.toObject(),
            imageUrl: recipe.imageUrl ? `${baseUrl}/${recipe.imageUrl}` : null, // Transform the imageUrl
        };
        return res.status(200).json({ 
            success: true,
            message:"Receipe data fetched", 
            data: formattedRecipe
        });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};

export const createRecipe = async (req: Request, res: Response,next: NextFunction): Promise<any> => {
    console.log('Request Body title: ', req.body);
    // Manually run the validation checks
    await Promise.all(createRecipeValidation.map(validation => validation.run(req)));
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ApiError(400, "Invalid data passed", validationErrors.array()));
    }
    const { title, ingredients, instructions } = req.body;
    const imageUrl = req.file ? req.file.filename : null;
    try {
        const newRecipe = new RecipeModel({ title, ingredients, instructions, imageUrl });
        await newRecipe.save();
        return res.status(201).json({
            success: true, 
            message:"Receipe created successfully", 
            data: newRecipe 
        });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};


export const updateRecipe = async (req: Request, res: Response,next: NextFunction): Promise<any> => {
    const { id } = req.params;
    //validate data passed
    await Promise.all(validateUpdateRecipe.map(validation => validation.run(req)));
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ApiError(400, "Invalid data passed", validationErrors.array()));
    }

    try {

        //validate the id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid ID format', 'The provided ID is not a valid MongoDB ObjectId');
        }

        // Fetch the existing recipe to retrieve the current image path
        const existingRecipe = await RecipeModel.findById(id);
        if (!existingRecipe) {
            throw new ApiError(404, 'Recipe not found');
        }

        // Build update object dynamically
        const updateData: Partial<{ title: string; ingredients: string[]; instructions: string; imageUrl: string }> = {};
        if (req.body.title) updateData.title = req.body.title;
        if (req.body.ingredients) updateData.ingredients = req.body.ingredients;
        if (req.body.instructions) updateData.instructions = req.body.instructions;

        // Handle image update
        const oldImagePath = existingRecipe.imageUrl;
        if (req.file) {
            updateData.imageUrl = `uploads/${req.file.filename}`;
        }

        const updatedRecipe = await RecipeModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedRecipe) {
            throw new ApiError(404, 'Recipe not found', []);
        }
        return res.status(200).json({ 
            success: true, 
            message:"Receipe updated successfully", 
            data: updatedRecipe 
        });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};


export const deleteRecipe = async (req: Request, res: Response,next: NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid ID format', 'The provided ID is not a valid MongoDB ObjectId');
        }
        const deletedRecipe = await RecipeModel.findByIdAndDelete(id);
        if (!deletedRecipe) {
            throw new ApiError(404, 'Recipe not found', []);
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Recipe deleted successfully' });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};
