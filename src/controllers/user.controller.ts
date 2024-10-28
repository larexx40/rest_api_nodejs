// src/controllers/receipe.controller.ts

import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../middlewares/error.middlware';
import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import { createUserValidation, updateUserValidation } from '../validations/receipe.validator copy';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const recipes = await UserModel.find(); // Fetch all recipes
        return res.status(200).json({ 
            success: true,
            message: "Users fetched successfully", 
            data: recipes 
        });
    } catch (error) {
        next(new ApiError(500, 'Server error'));
    }
};

export const getUserById = async (req: Request, res: Response ,next: NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid ID format', 'The provided ID is not a valid MongoDB ObjectId');
        }
        const user = await UserModel.findById(id);
        if (!user) {
            console.log("User with ID not found", id);
            
            throw new ApiError(404, 'User not found', []);
        }
        return res.status(200).json({ 
            success: true,
            message:"User data fetched", 
            data: user 
        });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};

export const createUser = async (req: Request, res: Response,next: NextFunction): Promise<any> => {
    // Manually run the validation checks
    await Promise.all(createUserValidation.map(validation => validation.run(req)));
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ApiError(400, "Invalid data passed", validationErrors.array()));
    }
    const { name, email, age } = req.body;
    try {
        const newRecipe = new UserModel({ name, email, age });
        await newRecipe.save();
        return res.status(201).json({
            success: true, 
            message:"User created successfully", 
            data: newRecipe 
        });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};


export const updateUser = async (req: Request, res: Response,next: NextFunction): Promise<any> => {
    const { id } = req.params;
    //validate data passed
    await Promise.all(updateUserValidation.map(validation => validation.run(req)));
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(new ApiError(400, "Invalid data passed", validationErrors.array()));
    }

    try {
        //validate the id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid ID format', 'The provided ID is not a valid MongoDB ObjectId');
        }

        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            throw new ApiError(404, 'User not found');
        }

        // Build update object dynamically
        const updateData: Partial<{ name: string; email: string; age: number }> = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.age) updateData.age = req.body.age;

        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            throw new ApiError(404, 'User not found', []);
        }
        return res.status(200).json({ 
            success: true, 
            message:"User updated successfully", 
            data: updatedUser 
        });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};


export const deleteUser = async (req: Request, res: Response,next: NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid ID format', 'The provided ID is not a valid MongoDB ObjectId');
        }
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new ApiError(404, 'User not found', []);
        }
        return res.status(200).json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Server error'));
    }
};
