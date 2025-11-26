// middleware/userExtractor.js
const userExtractor = (req, res, next) => {
  // Extract user data from headers
  const userData = {
    user_id: req.headers["x-user-id"],
    user_name: req.headers["x-user-name"],
    email: req.headers["x-user-email"],
    role: req.headers["x-user-role"],
  };

  // Only add to request if we have at least a user_id
  if (userData.user_id) {
    req.frontendUser = userData;
    console.log("Extracted user from headers:", userData);
  } else {
    req.frontendUser = null;
    console.log("No user data found in headers");
  }

  next();
};

module.exports = userExtractor;
