const nextId = require("../utils/nextId");

function validateOrderData(req, res, next) {
  const order = res.locals.order;
  const { data } = req.body;
  const { deliverTo, mobileNumber, dishes, status } = data;

  if (!order) {
    return res.status(404).json({ error: `Order with ID ${order.id} not found.` });
  }

  if (data.id !== undefined && data.id !== "" && data.id !== null) {
    if (data.id !== order.id) {
      return res.status(400).json({ error: `data id ${data.id} must match the order id ${order.id}` });
    }
  } else {
    data.id = order.id;
  }

  

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

  const validStatusValues = ['pending', 'preparing', 'out-for-delivery', 'delivered'];

  if (!validStatusValues.includes(status)) {
    return res.status(400).json({ error: 'status must be one of: pending, preparing, out-for-delivery, delivered' });
  }
  next();
}

module.exports = validateOrderData;
