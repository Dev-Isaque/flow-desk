import { useState } from "react";
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";

export function AddMemberModal({ workspaceId, onAdd }) {
  const [email, setEmail] = useState("");

  async function handleAdd() {
    if (!email.trim()) return;

    await onAdd(workspaceId, email);
    setEmail("");
  }

  return (
    <Modal
      id="modalMembro"
      title="Adicionar Novo Membro"
      footer={
        <>
          <button
            className="btn btn-link theme-text-muted text-decoration-none"
            data-bs-dismiss="modal"
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
