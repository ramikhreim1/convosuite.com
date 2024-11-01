// routes/categoryRoutes.js
const express = require('express');
const Category = require('../models/category');
const { isAdmin, verifyToken } = require('../auth/authJwt');
const ErrorHandler = require('../utils/errorhander');

const router = express.Router();

// Create a new category
router.post('/', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

// Bulk add categories
router.post('/bulk', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const categories = req.body; // An array of category objects
        const insertedCategories = await Category.insertMany(categories);
        res.json(insertedCategories);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Get all categories
router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

// Update a category
router.put('/:id', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!updatedCategory) {
            throw new ErrorHandler("Can't update category", 400)
        }
        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
});

// Delete a category
router.delete('/:id', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        res.json(deletedCategory);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
