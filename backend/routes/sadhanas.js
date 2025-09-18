const express = require('express');
const SadhanaController = require('../controllers/sadhanaController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, SadhanaController.getUserSadhanas);
router.post('/', authenticate, SadhanaController.createSadhana);
router.put('/:id', authenticate, SadhanaController.updateSadhana);
router.delete('/:id', authenticate, SadhanaController.deleteSadhana);
router.get('/:sadhanaId/progress', authenticate, SadhanaController.getSadhanaProgress);
router.post('/:sadhanaId/progress', authenticate, SadhanaController.upsertSadhanaProgress);

module.exports = router;