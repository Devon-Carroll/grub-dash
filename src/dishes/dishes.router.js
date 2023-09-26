const router = require("express").Router();
const controller = require("./dishes.controller");
// TODO: Implement the /dishes routes needed to make the tests pass

// Create routes for dishes
router.post('/', controller.createDish);
router.get('/', controller.listDishes);
router.get('/:dishId', controller.readDish);
router.put('/:dishId', controller.updateDish);

router.delete('/:dishId', controller.delete);

module.exports = router;


