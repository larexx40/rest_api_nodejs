import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import receipeRouter from './routers/receipe.router';
import { apiErrorHandler, methodNotAllowedHandler, notFoundHandler } from './middlewares/error.middlware';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routers/user.router';
import path from 'path';

dotenv.config();
connectDB();

const app = express();
// Use CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow your frontend domain
}));

// app.use(express.json());       
// app.use(express.urlencoded({extended: true})); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/recipes', receipeRouter);
app.use('/api/users', userRouter);
// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware should be registered after all routes and middleware
app.use(notFoundHandler);
app.use(methodNotAllowedHandler)
app.use(apiErrorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
