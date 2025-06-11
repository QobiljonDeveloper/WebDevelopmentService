const { Notification } = require("../models/notification.model");

const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    const notification = await Notification.create({ userId, message });
    res.status(201).json({ message: "Yaratildi", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({ where: { userId } });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notif = await Notification.findOne({ where: { id, userId } });
    if (!notif) return res.status(404).json({ message: "Topilmadi" });

    notif.isRead = true;
    await notif.save();

    res.json({ message: "O‘qilgan deb belgilandi", notif });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createNotification, getMyNotifications, markAsRead };
