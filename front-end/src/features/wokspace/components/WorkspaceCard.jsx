import { Users, MoreVertical } from "lucide-react";

export function WorkspaceCard({ workspace, onOpen }) {
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

        <button
          className="btn btn-sm p-0 theme-text-muted hover-primary"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={18} />
        </button>
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
