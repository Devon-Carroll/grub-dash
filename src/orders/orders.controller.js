// Import the necessary modules
const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

// Handler for creating a new order
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
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);
  
  if (order) {
    res.json({ data: order });
  } else {
    res.status(404).json({ error: `Order id not found: ${orderId}` });
  }
}


function update(req, res) {
  const { orderId } = req.params;
  const { data } = req.body;

  // Find the order by ID
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: `Order with ID ${orderId} not found.` });
  }

  // Check if data.id exists and is not empty or null
  if (data.id !== undefined && data.id !== "" && data.id !== null) {
    // Check if data.id doesn't match orderId
    if (data.id !== orderId) {
      return res.status(400).json({ error: `data id ${data.id} must match the order id ${orderId}` });
    }
  } else {
    // If data.id is not provided or is empty/null, set it to orderId
    data.id = orderId;
  }

  // Validate the incoming data fields
  const { deliverTo, mobileNumber, dishes, status } = data;

  if (!deliverTo || deliverTo === "") {
    return res.status(400).json({ error: 'deliverTo is missing or empty' });
  }

  if (!mobileNumber || mobileNumber === "") {
    return res.status(400).json({ error: 'mobileNumber is missing or empty' });
  }

  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return res.status(400).json({ error: 'dishes must be a non-empty array' });
  }

  for (let i = 0; i < dishes.length; i++) {
    const { quantity } = dishes[i];
    if (!quantity || typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: `dish ${i} must have a valid quantity` });
    }
  }

  // Define valid status values
  const validStatusValues = ['pending', 'preparing', 'out-for-delivery', 'delivered'];

  // Check if status is a valid value
  if (!validStatusValues.includes(status)) {
    return res.status(400).json({ error: 'status must be one of: pending, preparing, out-for-delivery, delivered' });
  }

  // Update the order
  Object.assign(order, data);

  res.status(200).json({ data: order });
}








function list(req, res) {
  // Retrieve the list of orders from your data source (e.g., orders array)
  const orderList = orders; // Replace this with your actual data retrieval logic

  // Return the list of orders as JSON
  res.json({ data: orderList });
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
  read,
  update,
  list,
  delete: [destroy],
};
