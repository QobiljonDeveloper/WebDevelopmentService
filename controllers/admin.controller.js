const { sendErrorResponse } = require("../helpers/send_error_response");
const Admin = require("../models/admin.model");
const logger = require("../services/logger.service");
const { updateAdminSchema } = require("../validation/admin.validation");
const bcrypt = require("bcrypt");
const { createAdminSchema } = require("../validation/admin.validation");

const getAllAdmins = async (req, res) => {
  try {
    logger.info("getAllAdmins called");
    const admins = await Admin.findAll();
    res.status(200).send(admins);
  } catch (error) {
    logger.error("getAllAdmins error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getAdminById called with id=${id}`);
    const admin = await Admin.findByPk(id);
    if (!admin) {
      logger.warn(`Admin with id=${id} not found`);
      return res.status(404).send({ message: "Admin topilmadi" });
    }
    res.status(200).send(admin);
  } catch (error) {
    logger.error("getAdminById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

  const createAdmin = async (req, res) => {
    try {
      logger.info("createAdmin called");

      const { error } = createAdminSchema.validate(req.body);
      if (error) {
        logger.warn(`Validation failed: ${error.message}`);
        return res.status(400).json({ message: error.message });
      }

      const { full_name, email, password, phone, isSuperAdmin } = req.body;

      const existing = await Admin.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: "Bu email allaqachon mavjud" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await Admin.create({
        full_name,
        email,
        password: hashedPassword,
        phone,
        isActive: true,
        isSuperAdmin: !!isSuperAdmin,
      });

      logger.info(`Admin ${email} yaratildi`);
      res.status(201).json({ message: "Admin yaratildi", admin: newAdmin });
    } catch (error) {
      logger.error("createAdmin error: " + error.message);
      sendErrorResponse(error, res);
    }
  };

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updateAdmin called with id=${id}`);

    const { error } = updateAdminSchema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.message}`);
      return res.status(400).send({ message: error.message });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      logger.warn(`Admin with id=${id} not found`);
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    await admin.update(req.body);
    logger.info(`Admin with id=${id} updated`);
    res.status(200).send({ message: "Admin yangilandi", admin });
  } catch (error) {
    logger.error("updateAdmin error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deleteAdmin called with id=${id}`);
    const admin = await Admin.findByPk(id);
    if (!admin) {
      logger.warn(`Admin with id=${id} not found`);
      return res.status(404).send({ message: "Admin topilmadi" });
    }
    await admin.destroy();
    logger.info(`Admin with id=${id} deleted`);
    res.status(200).send({ message: "Admin o'chirildi" });
  } catch (error) {
    logger.error("deleteAdmin error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  createAdmin,
};
