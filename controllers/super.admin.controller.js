const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");

const createSuperAdmin = async (req, res) => {
  try {
    const { full_name, email, password, phone, isSuperAdmin } = req.body;

    const exists = await Admin.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "Bu email allaqachon mavjud" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await Admin.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      isActive: true,
      isSuperAdmin: !!isSuperAdmin,
    });

    res.status(201).json({
      message: "Super admin yaratildi",
      admin: {
        id: superAdmin.id,
        full_name: superAdmin.full_name,
        email: superAdmin.email,
        phone: superAdmin.phone,
        isSuperAdmin: superAdmin.isSuperAdmin,
      },
    });
  } catch (error) {
    console.error("createSuperAdmin error:", error.message);
    res
      .status(500)
      .json({ message: "Xatolik yuz berdi", error: error.message });
  }
};

module.exports = { createSuperAdmin };
