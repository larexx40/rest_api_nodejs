// jest.setup.js
// import mongoose from 'mongoose';
import RecipeModel from './src/models/receipe.model';

// Mock all Mongoose methods that are used in tests
jest.mock('../models/receipe.model');

// Mock specific methods
const mockFind = jest.spyOn(RecipeModel, 'find').mockImplementation(() => ({
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([/* Mock recipes data here */]),
}));

const mockCountDocuments = jest.spyOn(RecipeModel, 'countDocuments').mockResolvedValue(10);

const mockFindById = jest.spyOn(RecipeModel, 'findById').mockImplementation((id) => ({
    exec: jest.fn().mockResolvedValue(id === 'validId' ? {/* Mock Recipe */} : null),
}));

const mockFindByIdAndUpdate = jest.spyOn(RecipeModel, 'findByIdAndUpdate').mockImplementation((id) => ({
    exec: jest.fn().mockResolvedValue(id === 'validId' ? {/* Mock Updated Recipe */} : null),
}));

const mockFindByIdAndDelete = jest.spyOn(RecipeModel, 'findByIdAndDelete').mockImplementation((id) => ({
    exec: jest.fn().mockResolvedValue(id === 'validId' ? {/* Mock Deleted Recipe */} : null),
}));

const mockSave = jest.fn().mockResolvedValue({/* Mock Created Recipe */});
RecipeModel.prototype.save = mockSave;
