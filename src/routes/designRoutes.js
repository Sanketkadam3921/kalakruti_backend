const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');

// All designs categories with static counts
router.get('/categories', designController.getAllCategories);

// Designs by category and details
router.get('/:categoryId', designController.getDesignsByCategory);
router.get('/:categoryId/:designSlug', designController.getDesignDetails);

module.exports = router;


