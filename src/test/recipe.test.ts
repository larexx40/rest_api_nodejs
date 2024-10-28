import request from 'supertest';
import app from '../index';
import RecipeModel from '../models/receipe.model';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Mock Data
const sampleId = "671ce49081cca9055ac26af9"
const sampleRecipe = {
    _id: "671ce49081cca9055ac26af9",
    title: "Sample Recipe",
    ingredients: ["ingredient1", "ingredient2"],
    instructions: "Mix all ingredients and cook.",
    imageUrl: "uploads/sample.jpg"
};

const sampleRecipeUpdate = {
    title: "Updated Recipe",
    ingredients: ["ingredient1", "ingredient3"],
    instructions: "Mix all ingredients differently and cook."
};

// Connect to a test database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI!);
});

// Clear the Recipe collection before each test
beforeEach(async () => {
    await RecipeModel.deleteMany({});
});

// Disconnect after all tests are done
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Recipe Controller', () => {
    let createdRecipeId: string;

    it('should fetch recipes with pagination', async () => {
        // Create a sample recipe to ensure there's data to fetch
        const recipe = new RecipeModel(sampleRecipe);
        await recipe.save();
        
        const response = await request(app).get('/api/recipes?page=1&limit=10');
        console.log(response.body);  // Log response for debugging
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.recipes)).toBe(true);
        expect(response.body.data.pagination.page).toBe(1);
        expect(response.body.data.recipes.length).toBeGreaterThan(0);
    });

    it('should create a new recipe', async () => {
        const response = await request(app)
            .post('/api/recipes')
            .send(sampleRecipe)
            .set('Accept', 'application/json');
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(sampleRecipe.title);
        createdRecipeId = response.body.data._id; // Store created recipe ID for later tests
    });

    it('should get recipe by ID', async () => {
        const response = await request(app).get(`/api/recipes/${sampleId}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(sampleRecipe.title);
    });

    it('should update a recipe', async () => {
        const response = await request(app)
            .put(`/api/recipes/${createdRecipeId}`)
            .send(sampleRecipeUpdate)
            .set('Accept', 'application/json');
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(sampleRecipeUpdate.title);
    });

    it('should delete a recipe', async () => {
        const response = await request(app).delete(`/api/recipes/${createdRecipeId}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Recipe deleted successfully');
    });

    it('should return 404 for non-existent recipe', async () => {
        const response = await request(app).get(`/api/recipes/${createdRecipeId}`);
        
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Recipe not found');
    });
});
