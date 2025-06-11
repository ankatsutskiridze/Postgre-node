import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles || !req.user.roles.includes("admin")) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
