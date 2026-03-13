import { Users, MoreVertical } from "lucide-react";

import { Button } from "../../../shared/components/Button";

export function WorkspaceCard({
  workspace,
  onOpen,
  onOpenSettings,
  onDelete,
  onLeave,
}) {
  return (
    <div className="workspace-card" onClick={() => onOpen(workspace.id)}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span
          className="badge rounded-pill"
          style={{
            backgroundColor: workspace.color || "var(--primary-color)",
            color: "#fff",
          }}
        >
          Ativo
        </span>

        <div className="dropstart" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn-sm p-0 theme-text-muted hover-primary"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="Mais opções"
          >
            <MoreVertical size={18} />
          </button>

          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings(workspace.id);
                }}
              >
                Configurações
              </button>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              {workspace.role === "OWNER" ? (
                <button
                  className="dropdown-item text-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(workspace.id);
                  }}
                >
                  Excluir
                </button>
              ) : (
                <button
                  className="dropdown-item text-warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLeave(workspace.id);
                  }}
                >
                  Sair do grupo
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>

      <h4 className="workspace-card-title">{workspace.name}</h4>

      <p className="workspace-card-desc">Espaço de trabalho compartilhado.</p>

      <div className="mt-auto">
        <div className="workspace-card-footer mb-2">
          <span>Progresso</span>
          <span>0%</span>
        </div>

        <div className="workspace-progress-bg">
          <div
            className="progress-bar h-100"
            style={{
              width: "0%",
              backgroundColor: workspace.color || "var(--primary-color)",
            }}
          />
        </div>

        <div className="workspace-card-footer">
          <div className="d-flex align-items-center">
            <Users size={14} className="me-1" />
            {workspace.memberCount || 1}
          </div>

          <span>Criado recentemente</span>
        </div>
      </div>
    </div>
  );
}
