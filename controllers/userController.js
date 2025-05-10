import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ყველა ფუნქცია Prisma-ს იყენებს და ექსპორტირდება გარე ფაილებისთვის

// ✅ CREATE – მომხმარებლის შექმნა
export const createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: { firstName, lastName, email },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "User creation failed" });
  }
};

// ✅ READ – ყველა მომხმარებლის წამოღება

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
  const { search } = req.query;

  const users = [
    { id: 1, name: "Anka", email: "anka@example.com" },
    { id: 2, name: "Nika", email: "nika@example.com" },
  ];

  if (!search) return res.json(users);

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  res.json(filtered);
};
