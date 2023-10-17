// middleware.js

// Middleware function to validate the incoming dish data
function validateDishData(req, res, next) {
  const dish = res.locals.dish
  const { data } = req.body;
  const { name, description, price, image_url } = data;
  if (data.id && data.id !== dish.id) {
    return res.status(400).json({ error: `data id ${data.id} does not match the dish id ${dish.id}` });
  }
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

  // If the data is valid, continue to the next middleware or route handler
  next();
}

module.exports = validateDishData;

