import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { AppError } from "../utils/errorhandler.js";
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.findUnique({
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

export const updateProfilePicture = async (req, res) => {
  const { id } = req.params;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const user = await prisma.users.update({
      where: { id: Number(id) },
      data: { profilePicture: file.path }, // Assuming 'profilePicture' is a field in your users table
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const count = await prisma.users.count();
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  try {
    const existingUser = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.users.update({
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
    await prisma.users.delete({
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
  const user = await prisma.users.create({
    data: { firstName, lastName, email, password: hashedPassword },
  });
  res.json(user);
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
      include: { roles: true }, // ← აქ ემატება როლის ჩათრევა
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid password", 401));
    }

    const token = jwt.sign(
      { id: user.id, roles: user.roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const { password: pw, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // პაროლის ჰაშირება
    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds 10

    const user = await prisma.users.create({
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

export const forgotPassword = async (req, res) => {
  console.log(req.body);

  const { email } = req.body;
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const otpCode = Math.floor(10000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 წუთი
  await prisma.users.update({
    where: { id: user.id },
    data: { otpCode, otpExpiry },
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "otp from password reset",
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
      <h2>პაროლის აღდგენა</h2>
      <p>შენი OTP კოდია:</p>
      <div style="font-size: 32px; color: red; font-weight: bold; letter-spacing: 8px;">
        ${otpCode}
      </div>
      <p>გთხოვ გამოიყენე ეს კოდი 10 წუთში</p>
    </div>
  `,
  };
  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otpCode, newPassword } = req.body;

  if (!email || !otpCode || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or OTP" });
  }

  if (user.otpCode !== otpCode || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid email or OTP" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    data: { password: hashedPassword, otpCode: null, otpExpiry: null },
  });

  res.json({ message: "Password reset successful" });
};
