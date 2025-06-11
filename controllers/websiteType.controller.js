const WebsiteType = require("../models/websiteType.model");
const {
  updatewebsiteTypeSchema,
  createwebsiteTypeSchema,
} = require("../validation/websitetype.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");
const logger = require("../services/logger.service");

const getAllWebsiteTypes = async (req, res) => {
  try {
    logger.info("getAllWebsiteTypes called");
    const websiteTypes = await WebsiteType.findAll();
    res.status(200).send({ message: "Barcha website turlari", websiteTypes });
  } catch (error) {
    logger.error("getAllWebsiteTypes error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getWebsiteTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getWebsiteTypeById called with id=${id}`);
    const websiteType = await WebsiteType.findByPk(id);
    if (!websiteType) {
      return res.status(404).send({ message: "Website turi topilmadi" });
    }
    res.status(200).send(websiteType);
  } catch (error) {
    logger.error("getWebsiteTypeById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const createWebsiteType = async (req, res) => {
  try {
    logger.info("createWebsiteType called");

    const { error } = createwebsiteTypeSchema.validate(req.body);
    if (error) {
      logger.warn("Validation error: " + error.message);
      return res.status(400).send({ message: error.message });
    }

    const { name, description } = req.body;
    const newWebsiteType = await WebsiteType.create({ name, description });
    res
      .status(201)
      .send({ message: "Website turi yaratildi", websiteType: newWebsiteType });
  } catch (error) {
    logger.error("createWebsiteType error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateWebsiteType = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updateWebsiteType called with id=${id}`);

    const { error } = updatewebsiteTypeSchema.validate(req.body);
    if (error) {
      logger.warn("Validation error: " + error.message);
      return res.status(400).send({ message: error.message });
    }

    const websiteType = await WebsiteType.findByPk(id);
    if (!websiteType) {
      return res.status(404).send({ message: "Website turi topilmadi" });
    }

    await websiteType.update(req.body);
    res.status(200).send({ message: "Website turi yangilandi", websiteType });
  } catch (error) {
    logger.error("updateWebsiteType error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteWebsiteType = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deleteWebsiteType called with id=${id}`);

    const websiteType = await WebsiteType.findByPk(id);
    if (!websiteType) {
      return res.status(404).send({ message: "Website turi topilmadi" });
    }

    await websiteType.destroy();
    res.status(200).send({ message: "Website turi o'chirildi" });
  } catch (error) {
    logger.error("deleteWebsiteType error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllWebsiteTypes,
  getWebsiteTypeById,
  createWebsiteType,
  updateWebsiteType,
  deleteWebsiteType,
};
