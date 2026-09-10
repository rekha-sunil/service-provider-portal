import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-brand"
        >
          Service Provider Portal
        </Link>

        <div className="navbar-links">

          {/* PROVIDER LINKS */}
          {user?.role === "provider" && (
            <>
              <Link to="/provider">
                Dashboard
              </Link>

              <Link to="/provider/profile">
                Profile
              </Link>

              <Link to="/provider/status">
                Status
              </Link>
            </>
          )}

          {/* ADMIN LINK */}
          {user?.role === "admin" && (
            <Link to="/admin">
              Admin Dashboard
            </Link>
          )}

          {/* LOGOUT */}
          {user && (
            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;