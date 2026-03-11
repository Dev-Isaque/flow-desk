import { useState } from "react";
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";

export function AddMemberModal({ show, workspaceId, onAdd, onClose }) {
  const [email, setEmail] = useState("");

  async function handleAdd() {
    if (!email.trim()) return;

    await onAdd(workspaceId, email);

    setEmail("");
    onClose();
  }

  if (!show) return null;

  return (
    <Modal
      id="modalMembro"
      title="Adicionar Novo Membro"
      show={show}
      footer={
        <>
          <button
            className="btn btn-link theme-text-muted text-decoration-none"
            onClick={onClose}
          >
            Cancelar
          </button>

          <Button className="btn-color px-4" onClick={handleAdd}>
            Adicionar
          </Button>
        </>
      }
    >
      <label className="form-label theme-text-muted fw-medium">
        E-mail do usuário
      </label>

      <input
        className="form-control theme-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="exemplo@email.com"
      />
    </Modal>
  );
}
