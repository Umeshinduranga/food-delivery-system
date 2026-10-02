const restaurantService = require('../services/restaurant.service');
const { sendError } = require('../utils/errors');

function create(request, response) {
  try {
    return response.status(201).json({ restaurant: restaurantService.create(request.body) });
  } catch (error) {
    return sendError(response, error);
  }
}

function list(request, response) {
  try {
    return response.json({ restaurants: restaurantService.list(request.query) });
  } catch (error) {
    return sendError(response, error);
  }
}

function getById(request, response) {
  try {
    return response.json({ restaurant: restaurantService.getById(request.params.id) });
  } catch (error) {
    return sendError(response, error);
  }
}

function update(request, response) {
  try {
    return response.json({
      restaurant: restaurantService.update(request.params.id, request.body),
    });
  } catch (error) {
    return sendError(response, error);
  }
}

function deactivate(request, response) {
  try {
    return response.json({
      restaurant: restaurantService.deactivate(request.params.id),
    });
  } catch (error) {
    return sendError(response, error);
  }
}

module.exports = { create, deactivate, getById, list, update };
