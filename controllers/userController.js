import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { firstName, lastName, email },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const searchUsers = (req, res) => {
  console.log("🔍 searchUsers function called");
  const { search } = req.query;

  const users = [
    { id: 1, name: "Anka", email: "anka@example.com" },
    { id: 3, name: "Luka", email: "lazarashvili@example.com" },
  ];

  if (!search) return res.json(users);

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );
  res.json(filtered);
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { firstName, lastName, email, password: hashedPassword },
  });
  res.json(user);
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: { roles: true },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.roles.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  delete user.password;
  res.json({ token, user });
};

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // პაროლის ჰაშირება
    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds 10

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword, // ჰაშირებული პაროლი
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "User creation failed" });
  }
};
