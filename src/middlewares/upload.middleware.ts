import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { ApiError } from './error.middlware';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads'); // Adjust path as necessary
        // Ensure the uploads directory exists
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                return cb(err,uploadDir); // Call the callback with the error if directory creation fails
            }
            cb(null, uploadDir); // Proceed to use the uploads directory
        });
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4(); // Generate a unique identifier
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, `${uniqueSuffix}${ext}`); // Set the new filename
    }
});

// Middleware to handle file upload
export const uploadImage = (fieldName: string) => {
    const upload = multer({
        storage: storage,
        limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2 MB
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new ApiError(400, 'Invalid image format, only images are allowed'));
            }
        },
    }).single(fieldName); // Use the dynamic field name

    return (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, (err) => {
            if (err) {
                return next(new ApiError(400, 'Image upload error: ' + err.message));
            }
            next(); // Proceed to the next middleware or route handler
        });
    };
};
