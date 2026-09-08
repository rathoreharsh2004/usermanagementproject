import User from "../models/User.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(body) {
  const errors = {};

  if (!body.name?.trim()) errors.name = "Name is required.";
  if (!body.email?.trim()) errors.email = "Email is required.";
  else if (!emailRegex.test(body.email.trim())) errors.email = "Enter a valid email.";

  if (!body.phone?.trim()) errors.phone = "Phone is required.";
  if (body.role && !["Admin", "Manager", "Member"].includes(body.role)) {
    errors.role = "Invalid role.";
  }
  if (body.status && !["Active", "Inactive"].includes(body.status)) {
    errors.status = "Invalid status.";
  }

  return errors;
}

export async function getUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const errors = validatePayload(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validation failed.", errors });
    }

    const user = await User.create({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      phone: req.body.phone.trim(),
      role: req.body.role || "Member",
      status: req.body.status || "Active"
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const errors = validatePayload(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validation failed.", errors });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        email: req.body.email.trim().toLowerCase(),
        phone: req.body.phone.trim(),
        role: req.body.role || "Member",
        status: req.body.status || "Active"
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const [total, active, inactive] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "Active" }),
      User.countDocuments({ status: "Inactive" })
    ]);

    res.json({ total, active, inactive });
  } catch (error) {
    next(error);
  }
}