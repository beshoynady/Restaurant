const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { authenticateToken } = require("../middlewares/authenticate");
const checkSubscription = require("../middlewares/checkSubscription");

router
  .route("/")
  .post(
    authenticateToken,
    checkSubscription,
    messageController.createCustomerMessage
  )
  .get(
    authenticateToken,
    checkSubscription,
    messageController.getAllCustomerMessages
  );

router
  .route("/:id")
  .get(
    authenticateToken,
    checkSubscription,
    messageController.getCustomerMessageById
  )
  .put(
    authenticateToken,
    checkSubscription,
    messageController.updateCustomerMessageById
  )
  .delete(
    authenticateToken,
    checkSubscription,
    messageController.deleteCustomerMessageById
  );

module.exports = router;
