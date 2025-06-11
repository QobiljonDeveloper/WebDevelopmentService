const { sendErrorResponse } = require("../helpers/send_error_response");
const { fn, col, literal } = require("sequelize");
const Developer = require("../models/developer.model");
const Website = require("../models/websites.model");
const Contract = require("../models/contract.model");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

const logger = require("../services/logger.service");
const { updateDeveloperSchema } = require("../validation/developer.validation");
const ContractDeveloper = require("../models/contractDeveloper");
const Client = require("../models/client.model");
const getAllDevelopers = async (req, res) => {
  try {
    logger.info("getAllDevelopers called");
    const developers = await Developer.findAll();
    res.status(200).send(developers);
  } catch (error) {
    logger.error("getAllDevelopers error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getDeveloperById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getDeveloperById called with id=${id}`);
    const developer = await Developer.findByPk(id);
    if (!developer) {
      logger.warn(`Developer with id=${id} not found`);
      return res.status(404).send({ message: "Developer topilmadi" });
    }
    res.status(200).send(developer);
  } catch (error) {
    logger.error("getDeveloperById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updateDeveloper called with id=${id}`);

    const { error } = updateDeveloperSchema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.message}`);
      return res.status(400).send({ message: error.message });
    }

    const developer = await Developer.findByPk(id);
    if (!developer) {
      logger.warn(`Developer with id=${id} not found`);
      return res.status(404).send({ message: "Developer topilmadi" });
    }

    await developer.update(req.body);
    logger.info(`Developer with id=${id} updated`);
    res.status(200).send({ message: "Developer yangilandi", developer });
  } catch (error) {
    logger.error("updateDeveloper error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deleteDeveloper called with id=${id}`);
    const developer = await Developer.findByPk(id);
    if (!developer) {
      logger.warn(`Developer with id=${id} not found`);
      return res.status(404).send({ message: "Developer topilmadi" });
    }
    await developer.destroy();
    logger.info(`Developer with id=${id} deleted`);
    res.status(200).send({ message: "Developer o'chirildi" });
  } catch (error) {
    logger.error("deleteDeveloper error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getTopDevelopersPerService = async (req, res) => {
  try {
    const results = await ContractDeveloper.findAll({
      include: [
        {
          model: Contract,
          include: [
            {
              model: Website,
              attributes: ["id", "title"], 
            },
          ],
          attributes: [],
        },
        {
          model: Developer,
          attributes: ["id", "full_name"],
        },
      ],
      attributes: [
        [col("contract->website.title"), "serviceTitle"],
        [col("developer.full_name"), "developerName"],
        [fn("COUNT", col("contractDeveloper.id")), "totalProjects"],
      ],
      group: [
        col("contract->website.id"),
        col("contract->website.title"),
        col("developer.id"),
        col("developer.full_name"),
      ],
      order: [
        [col("contract->website.title"), "ASC"],
        [fn("COUNT", col("contractDeveloper.id")), "DESC"],
      ],
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching top developers per service:", error);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllDevelopers,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
  getTopDevelopersPerService,
};
