import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ProviderDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get provider profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get(
          "/providers/profile"
        );

        setProfile(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Submit application
  const submitApplication = async () => {
    try {
      const response = await api.post(
        "/providers/submit"
      );

      alert(response.data.message);

      // Reload profile after submission
      window.location.reload();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to submit application"
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-container">
        <h2>Provider Dashboard</h2>

        <div className="error-message">
          {error}
        </div>

        <button
          onClick={() =>
            navigate("/provider/profile")
          }
        >
          Complete Profile
        </button>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Provider Dashboard</h1>

          <p>
            Welcome, {profile.user?.name}
          </p>
        </div>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      {/* Application Status */}
      <div className="status-card">
        <h2>Application Status</h2>

        <div
          className={`status ${profile.applicationStatus}`}
        >
          {profile.applicationStatus}
        </div>

        {/* Rejection Remark */}
        {profile.rejectionRemark && (
          <div className="remark">
            <strong>Admin Remark:</strong>

            <p>
              {profile.rejectionRemark}
            </p>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="dashboard-card">
        <h2>My Profile</h2>

        <p>
          <strong>Name:</strong>{" "}
          {profile.user?.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {profile.user?.email}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {profile.phone || "Not added"}
        </p>

        <p>
          <strong>Categories:</strong>{" "}
          {profile.categories?.join(", ") ||
            "Not added"}
        </p>

        <p>
          <strong>Skills:</strong>{" "}
          {profile.skills?.join(", ") ||
            "Not added"}
        </p>

        <p>
          <strong>Experience:</strong>{" "}
          {profile.experience} years
        </p>

        <p>
          <strong>City:</strong>{" "}
          {profile.location?.city ||
            "Not added"}
        </p>

        <p>
          <strong>State:</strong>{" "}
          {profile.location?.state ||
            "Not added"}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {profile.location?.address ||
            "Not added"}
        </p>

        {/* Edit Profile */}
        {profile.applicationStatus !==
          "approved" && (
          <button
            onClick={() =>
              navigate("/provider/profile")
            }
          >
            Edit Profile
          </button>
        )}

        {/* Submit Application */}
        {profile.applicationStatus ===
          "draft" && (
          <button
            onClick={submitApplication}
          >
            Submit Application
          </button>
        )}

        {/* Resubmit Application */}
        {profile.applicationStatus ===
          "rejected" && (
          <button
            onClick={submitApplication}
          >
            Resubmit Application
          </button>
        )}

        {/* Pending Message */}
        {profile.applicationStatus ===
          "pending" && (
          <p>
            Your application is currently under
            verification.
          </p>
        )}

        {/* Approved Message */}
        {profile.applicationStatus ===
          "approved" && (
          <p>
            Your application has been approved.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;