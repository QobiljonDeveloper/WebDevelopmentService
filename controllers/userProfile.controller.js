const UserProfile = require("../models/userProfile.model");
const logger = require("../services/logger.service");
const { sendErrorResponse } = require("../helpers/send_error_response");
const {
  createUserProfileSchema,
  updateUserProfileSchema,
} = require("../validation/userProfile.validation");

const getAllUserProfiles = async (req, res) => {
  try {
    logger.info("getAllUserProfiles called");
    const profiles = await UserProfile.findAll();
    res.status(200).send(profiles);
  } catch (error) {
    logger.error("getAllUserProfiles error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getUserProfileById called with id=${id}`);

    const profile = await UserProfile.findByPk(id);
    if (!profile) {
      logger.warn(`UserProfile with id=${id} not found`);
      return res.status(404).send({ message: "Profil topilmadi" });
    }

    res.status(200).send(profile);
  } catch (error) {
    logger.error("getUserProfileById error: " + error.message);
    sendErrorResponse(error, res);
  }
};


const createUserProfile = async (req, res) => {
  try {
    const { error } = createUserProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const id = req.user.id;
    const userType = req.userType;

    const profile = await UserProfile.create({
      ...req.body,
      userId: id,
      userType,
    });

    res.status(201).send({ message: "Profil yaratildi", profile });
  } catch (error) {
    logger.error("createUserProfile error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const profileId = req.params.id;

    const { error } = updateUserProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const profile = await UserProfile.findByPk(profileId);
    if (!profile) {
      return res.status(404).send({ message: "Profil topilmadi" });
    }

    await profile.update(req.body);
    res.status(200).send({ message: "Profil yangilandi", profile });
  } catch (error) {
    logger.error("updateUserProfile error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const profileId = req.params.id;

    const profile = await UserProfile.findByPk(profileId);
    if (!profile) {
      return res.status(404).send({ message: "Profil topilmadi" });
    }

    await profile.destroy();
    res.status(200).send({ message: "Profil o‘chirildi" });
  } catch (error) {
    logger.error("deleteUserProfile error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllUserProfiles,
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
