import request from 'supertest';
import app from '../index';
import RecipeModel from '../models/receipe.model';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUri = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST_URI : process.env.MONGO_URI;

const sampleRecipe = {
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

// Connect to the test database before all tests
beforeAll(async () => {
    await mongoose.connect(dbUri!);
});

// Disconnect after all tests are done
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Recipe Controller', () => {
    let createdRecipeId: string;

    // Create a new recipe before each test and store its ID for use in update and retrieval tests
    beforeEach(async () => {
        const recipe = await RecipeModel.create(sampleRecipe);
        createdRecipeId = recipe._id.toString(); // Capture created recipe ID
    });

    it('should fetch recipes with pagination', async () => {
        const response = await request(app).get('/api/recipes?page=1&limit=10');
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
    });

    it('should create and retrieve a recipe by ID', async () => {
        const response = await request(app).get(`/api/recipes/${createdRecipeId}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(sampleRecipe.title);
    });

    it('should update a recipe', async () => {
        const response = await request(app)
            .patch(`/api/recipes/${createdRecipeId}`)
            .send(sampleRecipeUpdate)
            .set('Accept', 'application/json');
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(sampleRecipeUpdate.title);
        expect(response.body.data.ingredients).toEqual(sampleRecipeUpdate.ingredients);
        expect(response.body.data.instructions).toBe(sampleRecipeUpdate.instructions);
    });

    it('should delete a recipe', async () => {
        const response = await request(app)
            .delete(`/api/recipes/${createdRecipeId}`)
            .set('Accept', 'application/json');
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Recipe deleted successfully');

        // Verify the recipe no longer exists in the database
        const findResponse = await RecipeModel.findById(createdRecipeId);
        expect(findResponse).toBeNull();
    });
});

    // it('should delete a recipe', async () => {
    //     const response = await request(app).delete(`/api/recipes/${createdRecipeId}`);
        
    //     expect(response.status).toBe(200);
    //     expect(response.body.success).toBe(true);
    //     expect(response.body.message).toBe('Recipe deleted successfully');
    // });

    // it('should return 404 for non-existent recipe', async () => {
    //     const response = await request(app).get(`/api/recipes/${createdRecipeId}`);
        
    //     expect(response.status).toBe(404);
    //     expect(response.body.success).toBe(false);
    //     expect(response.body.message).toBe('Recipe not found');
    // });
