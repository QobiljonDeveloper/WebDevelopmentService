const Status = require("../models/status.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const logger = require("../services/logger.service");
const {
  updateStatusSchema,
  createStatusSchema,
} = require("../validation/status.validation");

const getAllStatuses = async (req, res) => {
  try {
    logger.info("getAllStatuses called");
    const statuses = await Status.findAll();
    res.status(200).send({ message: "Barcha Statuslar", statuses });
  } catch (error) {
    logger.error("getAllStatuses error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getStatusById called with id=${id}`);
    const status = await Status.findByPk(id);
    if (!status) {
      logger.warn(`Status with id=${id} not found`);
      return res.status(404).send({ message: "Status topilmadi" });
    }
    res.status(200).send(status);
  } catch (error) {
    logger.error("getStatusById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const createStatus = async (req, res) => {
  try {
    logger.info("createStatus called");

    const { error } = createStatusSchema.validate(req.body);
    if (error) {
      logger.warn("Validation error: " + error.message);
      return res.status(400).send({ message: error.message });
    }

    const { name, description } = req.body;
    const newStatus = await Status.create({ name, description });
    logger.info("Status created with id=" + newStatus.id);
    res.status(201).send({ message: "Status yaratildi", status: newStatus });
  } catch (error) {
    logger.error("createStatus error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updateStatus called with id=${id}`);

    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      logger.warn("Validation error: " + error.message);
      return res.status(400).send({ message: error.message });
    }

    const status = await Status.findByPk(id);
    if (!status) {
      logger.warn(`Status with id=${id} not found`);
      return res.status(404).send({ message: "Status topilmadi" });
    }

    await status.update(req.body);
    logger.info(`Status with id=${id} updated`);
    res.status(200).send({ message: "Status yangilandi", status });
  } catch (error) {
    logger.error("updateStatus error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deleteStatus called with id=${id}`);
    const status = await Status.findByPk(id);
    if (!status) {
      logger.warn(`Status with id=${id} not found`);
      return res.status(404).send({ message: "Status topilmadi" });
    }
    await status.destroy();
    logger.info(`Status with id=${id} deleted`);
    res.status(200).send({ message: "Status o'chirildi" });
  } catch (error) {
    logger.error("deleteStatus error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
};
