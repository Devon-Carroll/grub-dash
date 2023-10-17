const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const validateDishData = require("../middleware/validateDishData");
// TODO: Implement the /dishes routes needed to make the tests pass

// Create routes for dishes
router.post('/', controller.createDish);
router.get('/', controller.listDishes);
router.get('/:dishId', controller.readDish);
router.put('/:dishId', controller.updateDish);

router.delete('/:dishId', controller.delete);
router.all(methodNotAllowed);

module.exports = router;


