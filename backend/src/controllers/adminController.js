const Provider = require("../models/Provider");

const getAllProviders = async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;

    const query = {};

    if (status) {
      query.applicationStatus = status;
    }

    let providers = await Provider.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (search) {
      const searchText = search.toLowerCase();

      providers = providers.filter((provider) => {
        const name =
          provider.user?.name?.toLowerCase() || "";

        const email =
          provider.user?.email?.toLowerCase() || "";

        const phone =
          provider.phone?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          phone.includes(searchText)
        );
      });
    }

    res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const approveProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(
      req.params.id
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.applicationStatus = "approved";
    provider.rejectionRemark = "";

    await provider.save();

    res.status(200).json({
      message: "Provider approved successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const rejectProvider = async (req, res) => {
  try {
    const { remark } = req.body;

    const provider = await Provider.findById(
      req.params.id
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.applicationStatus = "rejected";
    provider.rejectionRemark =
      remark || "Application rejected";

    await provider.save();

    res.status(200).json({
      message: "Provider rejected",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const total = await Provider.countDocuments();

    const pending =
      await Provider.countDocuments({
        applicationStatus: "pending",
      });

    const approved =
      await Provider.countDocuments({
        applicationStatus: "approved",
      });

    const rejected =
      await Provider.countDocuments({
        applicationStatus: "rejected",
      });

    res.status(200).json({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllProviders,
  approveProvider,
  rejectProvider,
  getDashboardStats,
};