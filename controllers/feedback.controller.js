const Feedback = require("../models/feedback.model");
const logger = require("../services/logger.service");
const { sendErrorResponse } = require("../helpers/send_error_response");
const {
  createFeedbackSchema,
  updateFeedbackSchema,
} = require("../validation/feedback.validation");

const getAllFeedbacks = async (req, res) => {
  try {
    logger.info("getAllFeedbacks called");

    const feedbacks = await Feedback.findAll();
    res.status(200).send(feedbacks);
  } catch (error) {
    logger.error("getAllFeedbacks error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getFeedbackById called with id=${id}`);

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      logger.warn(`Feedback with id=${id} not found`);
      return res.status(404).send({ message: "Feedback topilmadi" });
    }

    res.status(200).send(feedback);
  } catch (error) {
    logger.error("getFeedbackById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const createFeedback = async (req, res) => {
  try {
    const { error } = createFeedbackSchema.validate(req.body);
    if (error) {
      logger.warn("Validation failed: " + error.message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const userId = req.user.id;
    const userType = req.userType;

    const feedback = await Feedback.create({
      ...req.body,
      userId,
      userType,
    });

    logger.info("Feedback created successfully");
    res.status(201).send({ message: "Feedback yaratildi", feedback });
  } catch (error) {
    logger.error("createFeedback error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updateFeedback called with id=${id}`);

    const { error } = updateFeedbackSchema.validate(req.body);
    if (error) {
      logger.warn("Validation failed: " + error.message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      logger.warn(`Feedback with id=${id} not found`);
      return res.status(404).send({ message: "Feedback topilmadi" });
    }

    await feedback.update(req.body);
    logger.info(`Feedback with id=${id} updated`);
    res.status(200).send({ message: "Feedback yangilandi", feedback });
  } catch (error) {
    logger.error("updateFeedback error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deleteFeedback called with id=${id}`);

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      logger.warn(`Feedback with id=${id} not found`);
      return res.status(404).send({ message: "Feedback topilmadi" });
    }

    await feedback.destroy();
    logger.info(`Feedback with id=${id} deleted`);
    res.status(200).send({ message: "Feedback o'chirildi" });
  } catch (error) {
    logger.error("deleteFeedback error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
