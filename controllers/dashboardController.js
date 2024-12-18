const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments({}),
      activeUsers: await User.countDocuments({ isActive: true }),
      recentLogins: await User.find()
        .sort({ lastLogin: -1 })
        .limit(10)
        .select("email lastLogin"),
      // tambahkan statistik lain sesuai kebutuhan
    };

    return res
      .status(200)
      .json(ResponseWrapper.success(stats, "Dashboard stats berhasil diambil"));
  } catch (error) {
    return res
      .status(500)
      .json(
        ResponseWrapper.error(
          500,
          "Gagal mengambil dashboard stats",
          error.message
        )
      );
  }
};
