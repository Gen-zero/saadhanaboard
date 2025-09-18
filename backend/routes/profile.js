const express = require('express');
const ProfileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, ProfileController.getProfile);
router.put('/', authenticate, ProfileController.updateProfile);

module.exports = router;