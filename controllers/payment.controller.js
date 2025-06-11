const { sendErrorResponse } = require("../helpers/send_error_response");
const Payment = require("../models/payment.model");
const logger = require("../services/logger.service");
const {
  updatePaymentSchema,
  createPaymentSchema,
} = require("../validation/payment.validation");
const Contract = require("../models/contract.model");
const Status = require("../models/status.model");
const Website = require("../models/websites.model");
const Developer = require("../models/developer.model");
const ContractDeveloper = require("../models/contractDeveloper");

const getAllPayments = async (req, res) => {
  try {
    logger.info("getAllPayments called");

    const payments = await Payment.findAll({
      include: [{ model: Contract }, { model: Status }],
    });

    res.status(200).send(payments);
  } catch (error) {
    logger.error("getAllPayments error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`getPaymentById called with id=${id}`);

    const payment = await Payment.findByPk(id, {
      include: [{ model: Contract }, { model: Status }],
    });

    if (!payment) {
      logger.warn(`Payment with id=${id} not found`);
      return res.status(404).send({ message: "Payment topilmadi" });
    }

    res.status(200).send(payment);
  } catch (error) {
    logger.error("getPaymentById error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const createPayment = async (req, res) => {
  try {
    const { error } = createPaymentSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const clientId = req.user.id;
    const { contractId } = req.body;

    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(400).send({ message: "Shartnoma topilmadi" });
    }

    if (req.user.userType === "client" && contract.clientId !== clientId) {
      return res
        .status(403)
        .send({ message: "Bu shartnoma sizga tegishli emas" });
    }

    const payment = await Payment.create(req.body);

    res.status(201).send({ message: "Payment yaratildi", payment });
  } catch (error) {
    logger.error("createPayment error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`updatePayment called with id=${id}`);

    const { error } = updatePaymentSchema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.message}`);
      return res.status(400).send({ message: error.message });
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
      logger.warn(`Payment with id=${id} not found`);
      return res.status(404).send({ message: "Payment topilmadi" });
    }

    await payment.update(req.body);
    logger.info(`Payment with id=${id} updated`);
    res.status(200).send({ message: "Payment yangilandi", payment });
  } catch (error) {
    logger.error("updatePayment error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`deletePayment called with id=${id}`);

    const payment = await Payment.findByPk(id);
    if (!payment) {
      logger.warn(`Payment with id=${id} not found`);
      return res.status(404).send({ message: "Payment topilmadi" });
    }

    await payment.destroy();
    logger.info(`Payment with id=${id} deleted`);
    res.status(200).send({ message: "Payment o'chirildi" });
  } catch (error) {
    logger.error("deletePayment error: " + error.message);
    sendErrorResponse(error, res);
  }
};

const getClientPaymentsWithServiceAndOwner = async (req, res) => {
  try {
    const { clientId } = req.body;

    const payments = await Payment.findAll({
      include: [
        {
          model: Contract,
          where: { clientId },
          include: [
            {
              model: Website,
              attributes: ["id", "title"],
            },
            {
              model: ContractDeveloper,
              include: [
                {
                  model: Developer,
                  attributes: ["id", "full_name"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching client payments:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getClientPaymentsWithServiceAndOwner,
};
