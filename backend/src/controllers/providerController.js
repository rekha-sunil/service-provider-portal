const Provider = require("../models/Provider");

// Update Provider Profile
const updateProfile = async (req, res) => {
  try {
    const {
      phone,
      categories,
      skills,
      experience,
      city,
      state,
      address,
    } = req.body;

    let provider = await Provider.findOne({
      user: req.user._id,
    });

    // Approved profiles cannot be edited
    if (
      provider &&
      provider.applicationStatus === "approved"
    ) {
      return res.status(403).json({
        message: "Approved profiles cannot be edited",
      });
    }

    // Create profile if it does not exist
    if (!provider) {
      provider = await Provider.create({
        user: req.user._id,
        phone,
        categories,
        skills,
        experience,
        location: {
          city,
          state,
          address,
        },
      });
    } else {
      // Update only fields that were provided
      if (phone !== undefined) {
        provider.phone = phone;
      }

      if (categories !== undefined) {
        provider.categories = categories;
      }

      if (skills !== undefined) {
        provider.skills = skills;
      }

      if (experience !== undefined) {
        provider.experience = experience;
      }

      provider.location = {
        city:
          city !== undefined
            ? city
            : provider.location.city,

        state:
          state !== undefined
            ? state
            : provider.location.state,

        address:
          address !== undefined
            ? address
            : provider.location.address,
      };

      await provider.save();
    }

    res.status(200).json({
      message: "Profile updated successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Provider Profile
const getProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    }).populate(
      "user",
      "name email role"
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Submit Provider Application
const submitApplication = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    // Profile must exist
    if (!provider) {
      return res.status(404).json({
        message: "Please complete your profile first",
      });
    }

    // Already approved
    if (
      provider.applicationStatus === "approved"
    ) {
      return res.status(400).json({
        message: "Your application is already approved",
      });
    }

    // Already pending
    if (
      provider.applicationStatus === "pending"
    ) {
      return res.status(400).json({
        message: "Your application is already pending",
      });
    }

    // Validate phone
    if (!provider.phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    // Validate categories
    if (
      !provider.categories ||
      provider.categories.length === 0
    ) {
      return res.status(400).json({
        message: "At least one category is required",
      });
    }

    // Validate skills
    if (
      !provider.skills ||
      provider.skills.length === 0
    ) {
      return res.status(400).json({
        message: "At least one skill is required",
      });
    }

    // Validate experience
    if (
      provider.experience === undefined ||
      provider.experience === null ||
      provider.experience < 0
    ) {
      return res.status(400).json({
        message: "Valid experience is required",
      });
    }

    // Validate city
    if (!provider.location?.city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    // Validate state
    if (!provider.location?.state) {
      return res.status(400).json({
        message: "State is required",
      });
    }

    // Validate address
    if (!provider.location?.address) {
      return res.status(400).json({
        message: "Address is required",
      });
    }

    // Submit application
    provider.applicationStatus = "pending";

    // Clear old rejection remark when resubmitting
    provider.rejectionRemark = "";

    await provider.save();

    res.status(200).json({
      message:
        "Application submitted for verification",
      status: provider.applicationStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Upload Profile Photo
const uploadProfilePhoto = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a profile photo",
      });
    }

    const provider = await Provider.findOne({
      user: req.user._id,
    });

    // Profile must exist
    if (!provider) {
      return res.status(404).json({
        message: "Please complete your profile first",
      });
    }

    // Approved profiles cannot be edited
    if (
      provider.applicationStatus === "approved"
    ) {
      return res.status(403).json({
        message:
          "Approved profiles cannot be edited",
      });
    }

    // Save uploaded photo path
    provider.profilePhoto =
      `/uploads/${req.file.filename}`;

    await provider.save();

    res.status(200).json({
      message:
        "Profile photo uploaded successfully",
      profilePhoto: provider.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Upload Verification Document
const uploadDocument = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a document",
      });
    }

    const provider = await Provider.findOne({
      user: req.user._id,
    });

    // Profile must exist
    if (!provider) {
      return res.status(404).json({
        message: "Please complete your profile first",
      });
    }

    // Approved profiles cannot be edited
    if (
      provider.applicationStatus === "approved"
    ) {
      return res.status(403).json({
        message:
          "Approved profiles cannot be edited",
      });
    }

    // Add document
    provider.documents.push({
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
    });

    await provider.save();

    res.status(200).json({
      message: "Document uploaded successfully",
      document: {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Export Controllers
module.exports = {
  updateProfile,
  getProfile,
  submitApplication,
  uploadProfilePhoto,
  uploadDocument,
};