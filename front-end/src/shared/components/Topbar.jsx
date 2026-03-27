import { Bell, ArrowLeft } from "lucide-react";
import { AlternateTheme } from "./AlternateTheme";
import { useMe } from "../../features/user/hooks/useMe";

export function Topbar({ breadcrumb, onBack, workspaceRole }) {
  const { user } = useMe();

  const getInitials = (name) => {
    if (!name) return "US";
    const words = name.trim().split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatRole = (role) => {
    switch (role) {
      case "OWNER":
        return "Owner";
      case "ADMIN":
        return "Admin";
      case "MEMBER":
        return "Membro";
      default:
        return "";
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center w-100 mb-5">
      <div className="d-flex align-items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="btn btn-link p-0 border-0 theme-text hover-primary"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="small fw-medium theme-text-muted">
          {breadcrumb || "Home"}
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link p-0 border-0 theme-text hover-primary">
          <Bell size={18} />
        </button>

        <AlternateTheme />

        <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3 ms-1">
          <div className="text-end d-none d-md-block">
            <p
              className="mb-0 fw-semibold theme-text"
              style={{ fontSize: "0.85rem" }}
            >
              {user ? user.name : "Carregando..."}
            </p>
            <p
              className="mb-0 theme-text-muted"
              style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
            >
              {formatRole(workspaceRole) || ""}
            </p>
          </div>
          <div
            className="rounded-circle d-flex justify-content-center align-items-center fw-bold"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "var(--primary-color)",
              color: "#102222",
            }}
          >
            {user ? getInitials(user.name) : "..."}
          </div>
        </div>
      </div>
    </div>
  );
}
