const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
const validateDishData = require("../middleware/validateDishData");
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");



// TODO: Implement the /dishes handlers needed to make the tests pass
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if(foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${dishId}`,
  })
}

// Handler for creating a new dish
function createDish(req, res) {
    const { data } = req.body;

    // Validate the incoming data
    const { name, description, price, image_url } = data;
    if (!name) {
      return res.status(400).json({ error: 'name is missing' });
    } else if (!description) {
      return res.status(400).json({ error: 'description is missing' });
    } else if (!price) {
      return res.status(400).json({ error: 'price is missing' });
    } else if (price < 0) {
      return res.status(400).json({ error: 'price is missing' });
    } else if (!image_url) {
      return res.status(400).json({ error: 'image_url is missing' });
    }

    // Create a new dish object
    const newDish = {
      id: nextId(), // Use your nextId function to generate an ID
      ...data,
    };

    // Add the new dish to the dishes array
    dishes.push(newDish);

    // Respond with the newly created dish
    res.status(201).json({ data: newDish });
    res.status(500).json({ error: 'Internal server error.' });
}

// Handler for listing all dishes
function listDishes(req, res) {
  res.status(200).json({ data: dishes });
}

// Handler for reading a specific dish by ID
function readDish(req, res) {
  res.json(({ data: res.locals.dish }))
}

// Handler for updating a specific dish by ID
function updateDish(req, res) {
  const dish = res.locals.dish;
  const { data: { name, description, price, image_url } = {} } = req.body;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  
  res.json({data: dish })
  
}


function destroy(req, res, next) {
  next({
    status: 405,
    message: `Delete Method not allowed on ${req.originalUrl}`
  })
}

module.exports = {
  createDish,
  listDishes,
  readDish: [dishExists, readDish],
  updateDish: [
    dishExists,
    validateDishData,
    updateDish,
    
  ],
  delete: destroy,
};
