import { useState } from "react";
import { UserCheck } from "lucide-react";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";

import { useConfirm } from "../../../shared/hooks/useConfirm";

export function TaskCollaboratorsCard({
  collaborators = [],
  loading,
  members = [],
  addCollaborator,
  removeCollaborator,
  transferOwner,
  onTransferred,
}) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [role, setRole] = useState("VIEWER");

  const { confirm } = useConfirm();
  const currentOwnerId = collaborators.find((c) => c.role === "OWNER")?.userId;

  async function handleTransferOwner() {
    if (!selectedOwner || !transferOwner) return;

    const target = members.find((member) => member.userId === selectedOwner);
    const confirmed = await confirm({
      title: "Transferir responsável",
      message: `Deseja passar a responsabilidade desta tarefa para ${target?.name || "este usuário"}?`,
      confirmText: "Transferir",
      cancelText: "Cancelar",
      variant: "warning",
    });

    if (!confirmed) return;

    const transferred = await transferOwner(selectedOwner);
    if (transferred) {
      setSelectedOwner("");
      onTransferred?.();
    }
  }

  return (
    <div className="mt-3 p-3 theme-bg-card theme-border rounded">
      <div className="fw-semibold mb-3 theme-text">Colaboradores</div>

      {loading && <p className="theme-text-muted">Carregando...</p>}

      {!loading && collaborators.length === 0 && (
        <p className="theme-text-muted">Nenhum colaborador</p>
      )}

      <ul className="list-unstyled mb-3">
        {collaborators?.map((c) => (
          <li
            key={c.user?.id || c.userId}
            className="d-flex justify-content-between align-items-center mb-2"
          >
            <div>
              <strong>
                {c.user?.name ||
                  c.name ||
                  members.find((m) => m.userId === c.userId)?.name ||
                  "Usuário"}
              </strong>

              <div style={{ fontSize: "12px", opacity: 0.6 }}>{c.role}</div>
            </div>

            {c.role !== "OWNER" && (
              <Button
                className="btn-sm btn-danger"
                onClick={async () => {
                  const confirmed = await confirm(
                    "Deseja remover este colaborador?",
                  );
                  if (confirmed) {
                    removeCollaborator(c.user?.id || c.userId);
                  }
                }}
              >
                Remover
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="d-flex flex-column gap-2">
        {transferOwner && (
          <div className="border-bottom theme-border pb-3 mb-2">
            <label className="form-label small theme-text-muted mb-2">
              Transferir responsável
            </label>

            <div className="d-flex gap-2">
              <Input
                as="select"
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
              >
                <option value="">Selecionar novo responsável</option>
                {members
                  .filter((m) => m.userId !== currentOwnerId)
                  .map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.name}
                    </option>
                  ))}
              </Input>

              <Button
                className="btn-color"
                disabled={!selectedOwner}
                onClick={handleTransferOwner}
                title="Transferir responsável"
              >
                <UserCheck size={18} />
              </Button>
            </div>
          </div>
        )}

        <Input
          as="select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Selecionar usuário</option>
          {members.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.name}
            </option>
          ))}
        </Input>

        <Input
          as="select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="VIEWER">Viewer</option>
          <option value="COLLABORATOR">Editor</option>
        </Input>

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
