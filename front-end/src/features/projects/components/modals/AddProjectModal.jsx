import { useState } from "react";
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";

export function AddProjectModal({ show, onAdd, onClose, saving }) {
  const [name, setName] = useState("");

  async function handleAdd() {
    const clean = name.trim();
    if (!clean) return;

    const result = await onAdd({ name: clean });

    if (result?.ok) {
      setName("");
      onClose();
    }
  }

  if (!show) return null;

  return (
    <Modal
      id="modalProjeto"
      title="Criar Novo Projeto"
      show={show}
      footer={
        <>
          <button
            className="btn btn-link theme-text-muted text-decoration-none"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <Button
            className="btn-color px-4"
            onClick={handleAdd}
            disabled={saving}
          >
            Criar
          </Button>
        </>
      }
    >
      <label className="form-label theme-text-muted fw-medium">
        Nome do Projeto
      </label>

      <input
        className="form-control theme-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Digite o nome do projeto"
        disabled={saving}
      />
    </Modal>
  );
}