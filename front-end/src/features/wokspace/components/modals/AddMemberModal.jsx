import { useState } from "react";
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";

export function AddMemberModal({ show, workspaceId, onAdd, onClose }) {
  const [email, setEmail] = useState("");

  async function handleAdd() {
    if (!email.trim()) return;

    const invited = await onAdd(workspaceId, email);

    if (invited !== false) {
      setEmail("");
      onClose();
    }
  }

  if (!show) return null;

  return (
    <Modal
      id="modalMembro"
      title="Convidar Membro"
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
            Enviar convite
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
