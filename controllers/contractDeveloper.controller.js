const ContractDeveloper = require("../models/contractDeveloper");
const Contract = require("../models/contract.model");
const Developer = require("../models/developer.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const logger = require("../services/logger.service");

const getAllContractDevelopers = async (req, res) => {
  try {
    const records = await ContractDeveloper.findAll({
      include: [{ model: Contract }, { model: Developer }],
    });

    res
      .status(200)
      .send({ message: "Barcha contract-developer bog‘lanishlar", records });
  } catch (error) {
    logger.error("getAllContractDevelopers error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const createContractDeveloper = async (req, res) => {
  try {
    const { contractId, developerId } = req.body;

    if (!contractId || !developerId) {
      return res
        .status(400)
        .send({ message: "contractId va developerId majburiy" });
    }

    const newRecord = await ContractDeveloper.create({
      contractId,
      developerId,
    });

    res.status(201).send({ message: "Bog‘lanish yaratildi", data: newRecord });
  } catch (error) {
    logger.error("createContractDeveloper error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getContractDeveloperById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await ContractDeveloper.findByPk(id, {
      include: [{ model: Contract }, { model: Developer }],
    });

    if (!record) {
      return res.status(404).send({ message: "Bog‘lanish topilmadi" });
    }

    res.status(200).send(record);
  } catch (error) {
    logger.error("getContractDeveloperById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteContractDeveloper = async (req, res) => {
  try {
    const { contractId, developerId } = req.body;

    const record = await ContractDeveloper.findOne({
      where: { contractId, developerId },
    });

    if (!record) {
      return res.status(404).send({ message: "Bog‘lanish topilmadi" });
    }

    await record.destroy();


    res.status(200).send({ message: "Bog‘lanish muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    logger.error("deleteContractDeveloper error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllContractDevelopers,
  createContractDeveloper,
  getContractDeveloperById,
  deleteContractDeveloper,
};
