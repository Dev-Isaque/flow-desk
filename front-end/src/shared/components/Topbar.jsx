import { Bell, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { AlternateTheme } from "./AlternateTheme";
import { useMe } from "../../features/user/hooks/useMe";
import { useNotifications } from "../utils/useNotifications";

export function Topbar({ breadcrumb, onBack, workspaceRole }) {
  const { user } = useMe();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    isConnected,
    acceptInvitation,
    declineInvitation,
  } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

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

  const latestNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

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
        <div className="position-relative">
          <button
            className="btn btn-link p-0 border-0 theme-text hover-primary position-relative"
            onClick={() => setShowNotifications((prev) => !prev)}
            title={isConnected ? "Notificações ao vivo conectadas" : "Reconectando notificações"}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="position-absolute end-0 mt-2 p-2 border rounded shadow-sm bg-body"
              style={{ width: "320px", zIndex: 1200 }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                <span className="fw-semibold small">Notificações</span>
                <button
                  className="btn btn-link p-0 border-0 small text-decoration-none"
                  onClick={markAllAsRead}
                >
                  Marcar tudo como lido
                </button>
              </div>

              {latestNotifications.length === 0 ? (
                <p className="small text-muted mb-1 px-1">Sem notificações ainda.</p>
              ) : (
                latestNotifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 mb-1 rounded ${item.read ? "" : "border"} `}
                    style={{ background: item.read ? "transparent" : "rgba(13,110,253,0.07)" }}
                  >
                    <div className="small fw-medium">{item.message}</div>
                    <div className="small text-muted">
                      {new Date(item.createdAt).toLocaleString("pt-BR")}
                    </div>
                    {item.type === "workspace_invite" && item.invitationId && (
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-color flex-fill"
                          onClick={() => acceptInvitation(item.invitationId)}
                        >
                          Aceitar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary flex-fill"
                          onClick={() => declineInvitation(item.invitationId)}
                        >
                          Recusar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

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
