import { useState } from "react";
import { Button } from "../../../shared/components/Button";

export function TaskCollaboratorsCard({
  collaborators,
  loading,
  members,
  addCollaborator,
  removeCollaborator,
}) {
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("VIEWER");

  return (
    <div className="mt-3 p-3 theme-bg-card theme-border rounded">
      <div className="fw-semibold mb-3 theme-text">Colaboradores</div>

      {loading && <p className="theme-text-muted">Carregando...</p>}

      {!loading && collaborators.length === 0 && (
        <p className="theme-text-muted">Nenhum colaborador</p>
      )}

      <ul className="list-unstyled mb-3">
        {collaborators.map((c) => (
          <li
            key={c.user.id}
            className="d-flex justify-content-between align-items-center mb-2"
          >
            <div>
              <strong>{c.user.name}</strong>
              <div style={{ fontSize: "12px", opacity: 0.6 }}>{c.role}</div>
            </div>

            <Button
              className="btn-sm btn-danger"
              onClick={() => removeCollaborator(c.user.id)}
            >
              Remover
            </Button>
          </li>
        ))}
      </ul>

      <div className="d-flex flex-column gap-2">
        <select
          className="form-control"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Selecionar usuário</option>
          {members.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          className="form-control"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="VIEWER">Viewer</option>
          <option value="EDITOR">Editor</option>
        </select>

        <Button
          className="btn-color"
          disabled={!selectedUser}
          onClick={() => {
            addCollaborator(selectedUser, role);
            setSelectedUser("");
          }}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}
