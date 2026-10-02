const menuService = require('../services/menu.service');
const { sendError } = require('../utils/errors');

function create(request, response) {
  try {
    return response.status(201).json({
      item: menuService.create(request.params.restaurantId, request.body),
    });
  } catch (error) {
    return sendError(response, error);
  }
}

function list(request, response) {
  try {
    return response.json({
      items: menuService.list(request.params.restaurantId),
    });
  } catch (error) {
    return sendError(response, error);
  }
}

function categories(request, response) {
  try {
    return response.json({
      categories: menuService.categories(request.params.restaurantId),
    });
  } catch (error) {
    return sendError(response, error);
  }
}

function update(request, response) {
  try {
    return response.json({
      item: menuService.update(request.params.itemId, request.body),
    });
  } catch (error) {
    return sendError(response, error);
  }
}

function remove(request, response) {
  try {
    menuService.remove(request.params.itemId);
    return response.status(204).send();
  } catch (error) {
    return sendError(response, error);
  }
}

module.exports = { categories, create, list, remove, update };
