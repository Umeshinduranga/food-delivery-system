const express = require('express');
const menuController = require('../controllers/menu.controller');

const router = express.Router();

router.post('/restaurants/:restaurantId/menu-items', menuController.create);
router.get('/restaurants/:restaurantId/menu-items', menuController.list);
router.get('/restaurants/:restaurantId/menu-categories', menuController.categories);
router.patch('/menu-items/:itemId', menuController.update);
router.delete('/menu-items/:itemId', menuController.remove);

module.exports = router;
