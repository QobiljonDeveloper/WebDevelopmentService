const { sendErrorResponse } = require("../helpers/send_error_response");
const { Op } = require("sequelize");
const Contract = require("../models/contract.model");
const Client = require("../models/client.model");
const Developer = require("../models/developer.model");
const Status = require("../models/status.model");
const logger = require("../services/logger.service");
const {
  createContractSchema,
  updateContractSchema,
} = require("../validation/contract.validation");
const Website = require("../models/websites.model");

const getAllContracts = async (req, res) => {
  try {
    logger.info("getAllContracts called");
    const contracts = await Contract.findAll({
      include: [
        Client,
        {
          model: Website,
          attributes: {
            exclude: ["statusId", "typeId"],
          },
        },
        Status,
      ],
    });
    res.status(200).send(contracts);
  } catch (error) {
    logger.error("getAllContracts error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getContractById called with id=${id}`);
    const contract = await Contract.findByPk(id, {
      include: [
        Client,
        {
          model: Website,
          attributes: {
            exclude: ["statusId", "typeId"],
          },
        },
        Status,
      ],
    });
    if (!contract) {
      logger.warn(`Contract with id=${id} not found`);
      return res.status(404).send({ message: "Contract topilmadi" });
    }
    res.status(200).send(contract);
  } catch (error) {
    logger.error("getContractById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const createContract = async (req, res) => {
  try {
    const clientId = req.user.id;

    const contractData = {
      ...req.body,
      clientId,
    };

    const { error } = createContractSchema.validate(contractData);
    if (error) {
      logger.warn("Validation failed: 3" + error.message);
      return res.status(400).send({ message: error.message });
    }

    const contract = await Contract.create(contractData);
    logger.info(`Contract created with id=${contract.id}`);
    res.status(201).send({ message: "Contract yaratildi", contract });
  } catch (error) {
    logger.error("createContract error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updateContract called with id=${id}`);

    const { error } = updateContractSchema.validate(req.body);
    if (error) {
      logger.warn("Validation failed: " + error.message);
      return res.status(400).send({ message: error.message });
    }

    const contract = await Contract.findByPk(id);
    if (!contract) {
      logger.warn(`Contract with id=${id} not found`);
      return res.status(404).send({ message: "Contract topilmadi" });
    }

    await contract.update(req.body);
    logger.info(`Contract with id=${id} updated`);
    res.status(200).send({ message: "Contract yangilandi", contract });
  } catch (error) {
    logger.error("updateContract error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deleteContract called with id=${id}`);
    const contract = await Contract.findByPk(id);
    if (!contract) {
      logger.warn(`Contract with id=${id} not found`);
      return res.status(404).send({ message: "Contract topilmadi" });
    }
    await contract.destroy();
    logger.info(`Contract with id=${id} deleted`);
    res.status(200).send({ message: "Contract o'chirildi" });
  } catch (error) {
    logger.error("deleteContract error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getMyContracts = async (req, res) => {
  const clientId = req.user.id;
  const contracts = await Contract.findAll({ where: { clientId } });
  res.send(contracts);
};

const getContractsByWebsites = async (req, res) => {
  try {
    logger.info("getContractsByDateRange called");

    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) {
      return res.status(400).send({
        message:
          "Iltimos, body orqali 'from' va 'to' sanalarini yuboring (YYYY-MM-DD formatda)",
      });
    }
    const contracts = await Contract.findAll({
      where: {
        start_date: {
          [Op.gte]: start_date,
        },
        end_date: {
          [Op.lte]: end_date,
        },
      },
      include: [
        {
          model: Website,
          as: "website",
        },
      ],
    });

    const services = contracts.map((contract) => contract.website);

    res.status(200).send({
      message: "Berilgan vaqt oralig‘ida topilgan xizmatlar",
      services,
    });

    res.status(200).send({
      message: "Berilgan vaqt oralig‘ida topilgan xizmatlar",
      services,
    });
  } catch (error) {
    logger.error("getContractsByDateRange error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getClientsByDateRange = async (req, res) => {
  try {
    logger.info("getClientsByDateRange called");

    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) {
      return res.status(400).send({
        message: "Iltimos, 'start_date' va 'end_date' ni yuboring (YYYY-MM-DD)",
      });
    }

    const contracts = await Contract.findAll({
      where: {
        start_date: {
          [Op.gte]: start_date,
        },
        end_date: {
          [Op.lte]: end_date,
        },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "full_name", "email", "phone"],
        },
      ],
    });

    const clientsMap = new Map();

    contracts.forEach((contract) => {
      const client = contract.client;
      if (client && !clientsMap.has(client.id)) {
        clientsMap.set(client.id, client);
      }
    });

    const clients = Array.from(clientsMap.values());

    res.status(200).send({
      message: "Berilgan vaqt oralig‘ida xizmatdan foydalangan clientlar",
      clients,
    });
  } catch (error) {
    logger.error("getClientsByDateRange error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getCancelledClientsByDateRange = async (req, res) => {
  try {
    logger.info("getCancelledClientsByDateRange called");

    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) {
      return res.status(400).send({
        message:
          "Iltimos, body orqali 'start_date' va 'end_date' ni yuboring (YYYY-MM-DD formatda)",
      });
    }

    const contracts = await Contract.findAll({
      where: {
        start_date: { [Op.gte]: start_date },
        end_date: { [Op.lte]: end_date },
      },
      include: [
        {
          model: Status,
          where: { name: "Cancelled" },
        },
        {
          model: Client,
        },
      ],
    });

    const clients = contracts.map((contract) => contract.client);

    res.status(200).send({
      message: "Bekor qilingan xizmatlar bo‘yicha Clientlar ro‘yxati",
      clients,
    });
  } catch (error) {
    logger.error("getCancelledClientsByDateRange error: " + error.message);
    sendErrorResponse(error, res);
  }
};


module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getMyContracts,
  getContractsByWebsites,
  getClientsByDateRange,
  getCancelledClientsByDateRange,
};
