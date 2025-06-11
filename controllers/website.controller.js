const Website = require("../models/websites.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const logger = require("../services/logger.service");
const {
  createWebsiteSchema,
  updateWebsiteSchema,
} = require("../validation/website.validation");


const getAllWebsites = async (req, res) => {
  try {
    const websites = await Website.findAll();

    res.status(200).send({ message: "Barcha Website-lar", websites });
  } catch (error) {
    logger.error("getAllWebsites error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getWebsiteById = async (req, res) => {
  try {
    const { id } = req.params;

    const website = await Website.findByPk(id);

    if (!website) return res.status(404).send({ message: "Website topilmadi" });

    res.status(200).send(website);
  } catch (error) {
    logger.error("getWebsiteById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const createWebsite = async (req, res) => {
  try {
    const { error } = createWebsiteSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const website = await Website.create(req.body);
    res.status(201).send({ message: "Website yaratildi", website });
  } catch (error) {
    logger.error("createWebsite error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findByPk(id);
    if (!website) return res.status(404).send({ message: "Website topilmadi" });

    const { error } = updateWebsiteSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    await website.update(req.body);
    res.status(200).send({ message: "Website yangilandi", website });
  } catch (error) {
    logger.error("updateWebsite error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params;
    const website = await Website.findByPk(id);
    if (!website) return res.status(404).send({ message: "Website topilmadi" });

    await website.destroy();
    res.status(200).send({ message: "Website o'chirildi" });
  } catch (error) {
    logger.error("deleteWebsite error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllWebsites,
  getWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite,
};
