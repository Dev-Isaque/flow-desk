import { useState } from "react";
import { Input } from "../../../../shared/components/Input";
import { Button } from "../../../../shared/components/Button";

export function WorkspaceGeneral({ workspace, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    setForm({
      name: workspace?.name || "",
      description: workspace?.description || "",
    });
    setIsEditing(false);
  }

  async function handleSave() {
    await onSave?.(workspace.id, form);
    setIsEditing(false);
  }

  return (
    <div className="workspace-settings d-flex flex-column gap-4">
      <div className="settings-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="settings-title mb-0">Informações Gerais</h4>

          {!isEditing && (
            <Button
              className="btn-outline-primary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
          )}
        </div>

        <div className="settings-fields">
          <div className="settings-field mb-3">
            <Input
              label="Nome do Workspace"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="settings-field">
            <Input
              label="Descrição"
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-link theme-text-muted text-decoration-none"
              onClick={handleCancel}
            >
              Cancelar
            </button>

            <Button className="btn-color px-4" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        )}
      </div>

      <div className="settings-card border border-danger-subtle">
        <h5 className="text-danger mb-2">Zona de Perigo</h5>

        <p className="theme-text-muted mb-3">
          Excluir este workspace removerá permanentemente todos os projetos,
          membros e dados associados. Esta ação não pode ser desfeita.
        </p>

        <Button
          className="btn-danger"
          onClick={() => onDelete?.(workspace?.id)}
        >
          Excluir Workspace
        </Button>
      </div>
    </div>
  );
}
