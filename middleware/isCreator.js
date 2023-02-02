const Trip = require("../models/Trip.model");

module.exports = (req, res, next) => {
  const currenUserId = req.session.loggedUser._id;

  Trip.findById(req.params.tripObj)

    .then((tripObj) => {
      if (currenUserId.toString() !== tripObj.creator.toString()) {
        return res.redirect("/trips");
      }
      next();
    })
    .catch((error) => {
      next(error);
    });
};
