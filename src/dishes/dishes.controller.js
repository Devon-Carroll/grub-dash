const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


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
  const { dishId } = req.params;
  const dish = dishes.find((dish) => dish.id === dishId);

  if (dish) {
    res.status(200).json({ data: dish });
  } else {
    res.status(404).json({ error: 'Dish not found.' });
  }
}

// Handler for updating a specific dish by ID
function updateDish(req, res) {
  const { dishId } = req.params;
  const { data } = req.body;

  // Find the dish by ID
  const dish = dishes.find((dish) => dish.id === dishId);

  if (!dish) {
    return res.status(404).json({ error: `Dish with ID ${dishId} not found.` });
  }

  // Check if data.id exists and matches :dishId in the route
  if (data.id && data.id !== dishId) {
    return res.status(400).json({ error: `data id ${data.id} does not match the dish id ${dishId}` });
  }

  // Validate the incoming data (similar to createDish validation)
  const { name, description, price, image_url } = data;
    if (!name) {
      return res.status(400).json({ error: 'name is missing' });
    } else if (!description) {
      return res.status(400).json({ error: 'description is missing' });
    } else if (!price) {
      return res.status(400).json({ error: 'price is missing' });
    } else if (price < 0) {
      return res.status(400).json({ error: 'price is missing' });
    } else if (typeof price !== 'number'){
      return res.status(400).json({ error: 'price must be a number'});
    } else if (!image_url) {
      return res.status(400).json({ error: 'image_url is missing' });
    }
  

  // Update the dish
  Object.assign(dish, data);

  res.status(200).json({ data: dish });
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
  readDish,
  updateDish,
  delete: destroy,
};
