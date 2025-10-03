const express = require('express');
const router = express.Router();
const {
  createPreparationSection,
    getAllPreparationSections,
    getPreparationSectionById,
    updatePreparationSection,
    deletePreparationSection,
} = require('../controllers/preparation-section.controller');

const {authenticateToken} = require("../middlewares/authenticate");
const checkSubscription = require('../middlewares/checkSubscription')

router.route('/')
  .post(authenticateToken, checkSubscription, createPreparationSection)
  .get(authenticateToken, checkSubscription, getAllPreparationSections);

router.route('/:id')

  .get(authenticateToken, checkSubscription, getPreparationSectionById)
  .put(authenticateToken, checkSubscription, updatePreparationSection)
  .delete(authenticateToken, checkSubscription, deletePreparationSection);

module.exports = router;
