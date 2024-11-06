const jwt = require('jsonwebtoken');
JWT_SECRET = process.env.JWT_SECRET

const userMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy phần token sau "Bearer "

  if (!token) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    
    req.user = decoded;
    next();
  });
};


module.exports = userMiddleware;