const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const contactController = require('../controllers/contactController');

router.post('/' , contactController.submitContactForm)

module.exports = router ;
