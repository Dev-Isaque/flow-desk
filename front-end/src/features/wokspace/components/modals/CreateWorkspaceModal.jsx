import { useState } from "react";
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";

export function CreateWorkspaceModal({ onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#14b8a6");

  async function handleCreate() {
    if (!name.trim()) return;

    await onCreate(name, color);
    setName("");
    setColor("#14b8a6");
  }

  return (
    <Modal
      id="modalCriarGrupo"
      title="Criar Novo Grupo"
      footer={
        <>
          <button
            className="btn btn-link theme-text-muted text-decoration-none"
            data-bs-dismiss="modal"
          >
            Cancelar
          </button>

          <Button className="btn-color px-4" onClick={handleCreate}>
            Criar Grupo
          </Button>
        </>
      }
    >
      <div className="mb-3">
        <label className="form-label theme-text-muted fw-medium">
          Nome do Grupo
        </label>

        <input
          className="form-control theme-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da equipe"
        />
      </div>

      <div className="d-flex gap-2">
        {["#14b8a6", "#3b82f6", "#8b5cf6", "#f43f5e", "#f59e0b"].map((c) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 30,
              height: 30,
              backgroundColor: c,
              borderRadius: "50%",
              cursor: "pointer",
              border: color === c ? "3px solid var(--text-color)" : "none",
            }}
          />
        ))}
      </div>
    </Modal>
  );
}
