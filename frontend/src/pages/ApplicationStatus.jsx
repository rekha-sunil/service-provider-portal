import { useEffect, useState } from "react";
import api from "../services/api";

function ApplicationStatus() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    try {
      const response = await api.get("/providers/profile");

      const data = response.data.provider || response.data;

      setProvider(data);
    } catch (error) {
      console.error("STATUS LOAD ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load application status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
      setMessage("Please login to view application status.");
    }
  }, [token]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-card">
          <h2>Loading application status...</h2>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="page-container">
        <div className="form-card">
          <h2>Application Status</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  const status = provider.applicationStatus || "draft";

  const statusText = {
    draft: "Draft",
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  const statusDescription = {
    draft:
      "Please complete your profile and submit your application.",

    pending:
      "Your application has been submitted and is waiting for admin review.",

    approved:
      "Congratulations! Your application has been approved.",

    rejected:
      "Your application was rejected. Please review the admin remark and update your profile before resubmitting.",
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Application Status</h1>

        {/* STATUS */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h2>
            Status: {statusText[status] || "Unknown"}
          </h2>

          <p>
            {statusDescription[status] ||
              "Your application status is currently unavailable."}
          </p>
        </div>

        {/* STATUS STEPS */}
        <div style={{ marginTop: "30px" }}>
          <h3>Application Progress</h3>

          <div style={{ marginTop: "15px" }}>
            <p>
              {status === "draft" ||
              status === "pending" ||
              status === "approved" ||
              status === "rejected"
                ? "✅"
                : "⭕"}{" "}
              Profile Created
            </p>

            <p>
              {status === "pending" ||
              status === "approved" ||
              status === "rejected"
                ? "✅"
                : "⭕"}{" "}
              Application Submitted
            </p>

            <p>
              {status === "pending"
                ? "🔵"
                : status === "approved" ||
                  status === "rejected"
                ? "✅"
                : "⭕"}{" "}
              Admin Review
            </p>

            <p>
              {status === "approved"
                ? "✅ Approved"
                : status === "rejected"
                ? "❌ Rejected"
                : "⭕ Final Decision"}
            </p>
          </div>
        </div>

        {/* REJECTION REMARK */}
        {status === "rejected" &&
          provider.rejectionRemark && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <h3>Admin Remark</h3>

              <p>{provider.rejectionRemark}</p>

              <p>
                Please update your profile and
                resubmit your application.
              </p>
            </div>
          )}

        {/* PROVIDER INFORMATION */}
        <div style={{ marginTop: "30px" }}>
          <h3>Application Details</h3>

          <p>
            <strong>Phone:</strong>{" "}
            {provider.phone || "Not provided"}
          </p>

          <p>
            <strong>Experience:</strong>{" "}
            {provider.experience ?? 0} years
          </p>

          <p>
            <strong>City:</strong>{" "}
            {provider.location?.city ||
              "Not provided"}
          </p>

          <p>
            <strong>State:</strong>{" "}
            {provider.location?.state ||
              "Not provided"}
          </p>

          <p>
            <strong>Categories:</strong>{" "}
            {provider.categories?.length
              ? provider.categories.join(", ")
              : "Not provided"}
          </p>

          <p>
            <strong>Skills:</strong>{" "}
            {provider.skills?.length
              ? provider.skills.join(", ")
              : "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatus;