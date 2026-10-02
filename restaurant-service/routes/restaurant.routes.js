const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');

const router = express.Router();

router.post('/', restaurantController.create);
router.get('/', restaurantController.list);
router.get('/:id', restaurantController.getById);
router.patch('/:id', restaurantController.update);
router.delete('/:id', restaurantController.deactivate);

module.exports = router;
