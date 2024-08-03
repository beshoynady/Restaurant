const RestaurantModel = require('../models/Restaurant.model');

const checkSubscription = async (req, res, next) => {
  try {
    const restaurants = await RestaurantModel.find();
    const role = req.employee.role

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const restaurant = restaurants[0];

    const currentDate = new Date();
    if (currentDate > restaurant.subscriptionEnd && role !== 'programer') {
      return res.status(403).json({ message: 'Subscription has ended' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = checkSubscription;
