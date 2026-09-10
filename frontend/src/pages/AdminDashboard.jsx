import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState(null);

  const loadDashboard = async () => {
    try {
      const [statsResponse, providersResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/providers"),
      ]);

      setStats(statsResponse.data);
      setProviders(providersResponse.data.providers || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const approveProvider = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this provider?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.put(`/admin/providers/${id}/approve`);

      alert("Provider approved successfully");

      setSelectedProvider(null);

      loadDashboard();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Approval failed"
      );
    }
  };

  const rejectProvider = async (id) => {
    const remark = window.prompt(
      "Enter rejection remark:"
    );

    if (remark === null) {
      return;
    }

    if (!remark.trim()) {
      alert("Please enter a rejection remark");
      return;
    }

    try {
      await api.put(
        `/admin/providers/${id}/reject`,
        {
          remark: remark.trim(),
        }
      );

      alert("Provider rejected");

      setSelectedProvider(null);

      loadDashboard();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Rejection failed"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const filteredProviders = providers.filter(
    (provider) => {
      const name =
        provider.user?.name?.toLowerCase() || "";

      const email =
        provider.user?.email?.toLowerCase() || "";

      const phone =
        provider.phone?.toLowerCase() || "";

      const categories =
        provider.categories
          ?.join(" ")
          .toLowerCase() || "";

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText) ||
        categories.includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        provider.applicationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage service provider applications
          </p>
        </div>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Providers</h3>
          <strong>{stats.total}</strong>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <strong>{stats.pending}</strong>
        </div>

        <div className="stat-card">
          <h3>Approved</h3>
          <strong>{stats.approved}</strong>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <strong>{stats.rejected}</strong>
        </div>

      </div>

      {/* Provider Management */}
      <div className="dashboard-card">

        <div className="provider-list-header">
          <div>
            <h2>Service Providers</h2>
            <p>
              Review and manage provider applications
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="admin-filters">

          <input
            type="text"
            placeholder="Search by name, email, phone or category"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Statuses
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>

        </div>

        {/* Provider Table */}
        {filteredProviders.length === 0 ? (
          <p>
            No providers match your search.
          </p>
        ) : (
          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Categories</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProviders.map(
                  (provider) => (

                    <tr key={provider._id}>

                      <td>
                        {provider.user?.name ||
                          "N/A"}
                      </td>

                      <td>
                        {provider.user?.email ||
                          "N/A"}
                      </td>

                      <td>
                        {provider.phone ||
                          "N/A"}
                      </td>

                      <td>
                        {provider.categories?.join(
                          ", "
                        ) || "N/A"}
                      </td>

                      <td>
                        {provider.experience || 0} years
                      </td>

                      <td>
                        {provider.location?.city ||
                          "N/A"}
                        {provider.location?.state
                          ? `, ${provider.location.state}`
                          : ""}
                      </td>

                      <td>
                        <span
                          className={`status ${provider.applicationStatus}`}
                        >
                          {provider.applicationStatus}
                        </span>
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            onClick={() =>
                              setSelectedProvider(
                                provider
                              )
                            }
                          >
                            View
                          </button>

                          {provider.applicationStatus !==
                            "approved" && (
                            <button
                              onClick={() =>
                                approveProvider(
                                  provider._id
                                )
                              }
                            >
                              Approve
                            </button>
                          )}

                          {provider.applicationStatus !==
                            "rejected" && (
                            <button
                              onClick={() =>
                                rejectProvider(
                                  provider._id
                                )
                              }
                            >
                              Reject
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Provider Details */}
      {selectedProvider && (
        <div className="provider-details-card">

          <div className="details-header">

            <div>
              <h2>Provider Details</h2>
              <p>
                Review complete provider information
              </p>
            </div>

            <button
              onClick={() =>
                setSelectedProvider(null)
              }
            >
              Close
            </button>

          </div>

          <div className="details-grid">

            <div>
              <strong>Name</strong>
              <p>
                {selectedProvider.user?.name ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>Email</strong>
              <p>
                {selectedProvider.user?.email ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>Phone</strong>
              <p>
                {selectedProvider.phone ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>Experience</strong>
              <p>
                {selectedProvider.experience || 0} years
              </p>
            </div>

            <div>
              <strong>Categories</strong>
              <p>
                {selectedProvider.categories?.join(
                  ", "
                ) || "N/A"}
              </p>
            </div>

            <div>
              <strong>Skills</strong>
              <p>
                {selectedProvider.skills?.join(
                  ", "
                ) || "N/A"}
              </p>
            </div>

            <div>
              <strong>City</strong>
              <p>
                {selectedProvider.location?.city ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>State</strong>
              <p>
                {selectedProvider.location?.state ||
                  "N/A"}
              </p>
            </div>

            <div className="full-width">
              <strong>Address</strong>
              <p>
                {selectedProvider.location?.address ||
                  "N/A"}
              </p>
            </div>

            <div>
              <strong>Status</strong>
              <p>
                <span
                  className={`status ${selectedProvider.applicationStatus}`}
                >
                  {selectedProvider.applicationStatus}
                </span>
              </p>
            </div>

            {selectedProvider.rejectionRemark && (
              <div className="full-width">
                <strong>Rejection Remark</strong>
                <p>
                  {selectedProvider.rejectionRemark}
                </p>
              </div>
            )}

          </div>

          {/* Details Actions */}
          {selectedProvider.applicationStatus !==
            "approved" && (
            <button
              onClick={() =>
                approveProvider(
                  selectedProvider._id
                )
              }
            >
              Approve Provider
            </button>
          )}

          {selectedProvider.applicationStatus !==
            "rejected" && (
            <button
              onClick={() =>
                rejectProvider(
                  selectedProvider._id
                )
              }
            >
              Reject Provider
            </button>
          )}

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;