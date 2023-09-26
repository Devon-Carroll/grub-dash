const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Create routes for orders
router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:orderId', controller.read);
router.put('/:orderId', controller.update);
router.delete('/:orderId', controller.delete);

// Attach the methodNotAllowed handler for unsupported methods
router
  .route('/:orderId')
  .all(methodNotAllowed);

router
  .route('/')
  .all(methodNotAllowed);

module.exports = router;

