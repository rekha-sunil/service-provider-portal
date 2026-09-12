import { useEffect, useState } from "react";

import api from "../services/api";

function ProviderProfile() {
  const [formData, setFormData] = useState({
    phone: "",
    categories: "",
    skills: "",
    experience: "",
    city: "",
    state: "",
    address: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument] = useState(null);

  const [savedPhoto, setSavedPhoto] = useState("");
  const [savedDocuments, setSavedDocuments] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Get backend URL for uploaded files
  const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/providers/profile");

        const provider =
          response.data.provider || response.data;

        if (!provider) {
          return;
        }

        setFormData({
          phone: provider.phone || "",

          categories: provider.categories
            ? provider.categories.join(", ")
            : "",

          skills: provider.skills
            ? provider.skills.join(", ")
            : "",

          experience:
            provider.experience !== undefined
              ? provider.experience
              : "",

          city: provider.location?.city || "",
          state: provider.location?.state || "",
          address: provider.location?.address || "",
        });

        setSavedPhoto(provider.profilePhoto || "");
        setSavedDocuments(provider.documents || []);
      } catch (error) {
        console.error("PROFILE LOAD ERROR:", error);

        setMessage(
          error.response?.data?.message ||
            "Unable to load profile"
        );
      }
    };

    if (token) {
      loadProfile();
    }
  }, [token]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const phone = formData.phone.trim();

    const categories = formData.categories
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const skills = formData.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const experience = Number(formData.experience);

    const city = formData.city.trim();
    const state = formData.state.trim();
    const address = formData.address.trim();

    // Validation
    if (!/^\d{10}$/.test(phone)) {
      setMessage(
        "Phone number must contain exactly 10 digits"
      );
      return;
    }

    if (categories.length === 0) {
      setMessage("Please enter at least one category");
      return;
    }

    if (skills.length === 0) {
      setMessage("Please enter at least one skill");
      return;
    }

    if (
      formData.experience === "" ||
      Number.isNaN(experience) ||
      experience < 0
    ) {
      setMessage("Please enter valid experience");
      return;
    }

    if (!city) {
      setMessage("City is required");
      return;
    }

    if (!state) {
      setMessage("State is required");
      return;
    }

    if (!address) {
      setMessage("Address is required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.put(
        "/providers/profile",
        {
          phone,
          categories,
          skills,
          experience,
          city,
          state,
          address,
        }
      );

      setMessage(
        response.data.message || "Profile updated successfully"
      );
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Upload profile photo
  const handlePhotoUpload = async () => {
    if (!profilePhoto) {
      setMessage("Please select a profile photo");
      return;
    }

    setPhotoLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      data.append("profilePhoto", profilePhoto);

      const response = await api.post(
        "/providers/upload/profile-photo",
        data
      );

      const result = response.data;

      setMessage(
        result.message || "Profile photo uploaded successfully"
      );

      const uploadedProvider =
        result.provider || result;

      if (uploadedProvider.profilePhoto) {
        setSavedPhoto(uploadedProvider.profilePhoto);
      }

      setProfilePhoto(null);
    } catch (error) {
      console.error(
        "PHOTO UPLOAD ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Profile photo upload failed"
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  // Upload verification document
  const handleDocumentUpload = async () => {
    if (!document) {
      setMessage(
        "Please select a verification document"
      );
      return;
    }

    setDocumentLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      data.append("document", document);

      const response = await api.post(
        "/providers/upload/document",
        data
      );

      const result = response.data;

      setMessage(
        result.message ||
          "Document uploaded successfully"
      );

      const uploadedProvider =
        result.provider || result;

      if (uploadedProvider.documents) {
        setSavedDocuments(
          uploadedProvider.documents
        );
      }

      setDocument(null);
    } catch (error) {
      console.error(
        "DOCUMENT UPLOAD ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Document upload failed"
      );
    } finally {
      setDocumentLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">

        <h1>Complete Your Profile</h1>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {/* PROFILE FORM */}

        <form onSubmit={handleSubmit}>

          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            maxLength={10}
            required
          />

          <label>Categories</label>

          <input
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            placeholder="Plumbing, Electrical"
            required
          />

          <small>
            Separate multiple categories with commas
          </small>

          <label>Skills</label>

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Pipe Repair, Wiring"
            required
          />

          <small>
            Separate multiple skills with commas
          </small>

          <label>Experience (years)</label>

          <input
            type="number"
            name="experience"
            min="0"
            value={formData.experience}
            onChange={handleChange}
            required
          />

          <label>City</label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
          />

          <label>State</label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            required
          />

          <label>Address</label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter complete address"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </button>

        </form>

        <hr />

        {/* PROFILE PHOTO */}

        <h2>Profile Photo</h2>

        {savedPhoto && (
          <div>
            <p>
              <strong>
                Uploaded Photo:
              </strong>
            </p>

            <img
              src={`${API_BASE_URL}${savedPhoto}`}
              alt="Provider profile"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
          </div>
        )}

        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => {
            setProfilePhoto(
              e.target.files[0]
            );
            setMessage("");
          }}
        />

        {profilePhoto && (
          <p>
            Selected: {profilePhoto.name}
          </p>
        )}

        <button
          type="button"
          onClick={handlePhotoUpload}
          disabled={photoLoading}
        >
          {photoLoading
            ? "Uploading..."
            : "Upload Profile Photo"}
        </button>

        <hr />

        {/* VERIFICATION DOCUMENT */}

        <h2>
          Verification Document
        </h2>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => {
            setDocument(
              e.target.files[0]
            );
            setMessage("");
          }}
        />

        {document && (
          <p>
            Selected: {document.name}
          </p>
        )}

        <button
          type="button"
          onClick={handleDocumentUpload}
          disabled={documentLoading}
        >
          {documentLoading
            ? "Uploading..."
            : "Upload Verification Document"}
        </button>

        {/* SAVED DOCUMENTS */}

        {savedDocuments.length > 0 && (
          <div
            style={{
              marginTop: "25px",
            }}
          >
            <h3>
              Uploaded Documents
            </h3>

            {savedDocuments.map(
              (doc, index) => (
                <div
                  key={
                    doc._id || index
                  }
                  style={{
                    padding: "10px",
                    marginBottom: "10px",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "8px",
                  }}
                >
                  <p>
                    📄{" "}
                    <strong>
                      {doc.name}
                    </strong>
                  </p>

                  <a
                    href={`${API_BASE_URL}${doc.url}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Document
                  </a>
                </div>
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ProviderProfile;