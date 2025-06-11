const isSuperAdminGuard = (req, res, next) => {
  try {
    if (req.userType !== "admin" || !req.user.isSuperAdmin) {
      return res
        .status(403)
        .json({ message: "Faqat super admin kirish huquqiga ega" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Ichki xatolik", error: error.message });
  }
};

module.exports = isSuperAdminGuard;
