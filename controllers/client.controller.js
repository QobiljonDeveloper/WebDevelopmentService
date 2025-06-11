const { sendErrorResponse } = require("../helpers/send_error_response");
const Client = require("../models/client.model");
const logger = require("../services/logger.service");
const { updateClientSchema } = require("../validation/client.validation");
const getAllClients = async (req, res) => {
  try {
    logger.info("getAllClients called");
    const clients = await Client.findAll();
    res.status(200).send(clients);
  } catch (error) {
    logger.error("getAllClients error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getClientById called with id=${id}`);
    const client = await Client.findByPk(id);
    if (!client) {
      logger.warn(`Client with id=${id} not found`);
      return res.status(404).send({ message: "Client topilmadi" });
    }
    res.status(200).send(client);
  } catch (error) {
    logger.error("getClientById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updateClient called with id=${id}`);

    const { error } = updateClientSchema.validate(req.body);
    if (error) {
      logger.warn("Validation error: " + error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const client = await Client.findByPk(id);
    if (!client) {
      logger.warn(`Client with id=${id} not found`);
      return res.status(404).send({ message: "Client topilmadi" });
    }

    await client.update(req.body);
    logger.info(`Client with id=${id} updated`);
    res.status(200).send({ message: "Client yangilandi", client });
  } catch (error) {
    logger.error("updateClient error: " + error.message);
    sendErrorResponse(error, res);
  }
};
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deleteClient called with id=${id}`);
    const client = await Client.findByPk(id);
    if (!client) {
      logger.warn(`Client with id=${id} not found`);
      return res.status(404).send({ message: "Client topilmadi" });
    }
    await client.destroy();
    logger.info(`Client with id=${id} deleted`);
    res.status(200).send({ message: "Client o'chirildi" });
  } catch (error) {
    logger.error("deleteClient error: " + error.message);
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
