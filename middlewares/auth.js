import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(decoded);

    req.user = decoded;
    next();
  });
};

export const isAdmini = (req, res, next) => {
  if (req.user.role !== "admin")
    return res
      .status(401)
      .json({ message: "Only admins can access this router" });
  next();
};
