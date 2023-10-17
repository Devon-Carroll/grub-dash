// Import the necessary modules
const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");
const validateOrderData = require("../middleware/validateOrderData");

// Handler for creating a new order
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if(foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
    })
}

function create(req, res) {
  const { data } = req.body;

  // Validate the incoming data
  const { deliverTo, mobileNumber, dishes } = data;
  if (!deliverTo) {
    return res.status(400).json({ error: 'deliverTo is missing' });
  } else if (!mobileNumber) {
    return res.status(400).json({ error: 'mobileNumber is missing' });
  } else if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return res.status(400).json({ error: 'dishes must be a non-empty array' });
  } else {
    for (let i = 0; i < dishes.length; i++) {
      const { quantity } = dishes[i];
      if (!quantity || typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: `dish ${i} must have a valid quantity` });
      }
    }
  }

  // Create a new order object
  const newOrder = {
    id: nextId(),
    ...data,
  };

  // Add the new order to the orders array
  orders.push(newOrder);

  // Respond with the newly created order
  res.status(201).json({ data: newOrder });
}

function read(req, res) {
  res.json(({ data: res.locals.order }));
}


function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  console.log(order)
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.dishes = dishes;
  order.status = status;
  
  res.json({data: order})
  
}








function list(req, res) {
  res.json({ data: orders });
}

function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);

  if (index !== -1) {
    const order = orders[index];

    if (order.status === 'pending') {
      // Remove the order from the orders array
      orders.splice(index, 1);

      // Send a 204 No Content response
      res.status(204).end();
    } else {
      // If the order status is not 'pending', return a 400 Bad Request response
      res.status(400).json({ error: `Order with ID ${orderId} cannot be deleted because its status is not 'pending'.` });
    }
  } else {
    // If the order does not exist, return a 404 Not Found response
    res.status(404).json({ error: `Order with ID ${orderId} not found.` });
  }
}



// Export the createOrder handler
module.exports = {
  create,
  list,
  read: [orderExists, read],
  update: [
    orderExists, 
    validateOrderData, 
    update
  ],
  delete: [destroy],
};
