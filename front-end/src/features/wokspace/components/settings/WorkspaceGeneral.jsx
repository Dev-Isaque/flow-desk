import { useState } from "react";

import { Input } from "../../../../shared/components/Input";
import { Button } from "../../../../shared/components/Button";

import { useConfirm } from "../../../../shared/hooks/useConfirm";

export function WorkspaceGeneral({ workspace, onSave, onDelete, canManageWorkspace = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { confirm } = useConfirm();

  function startEditing() {
    if (!canManageWorkspace) return;
    setForm({
      name: workspace?.name || "",
      description: workspace?.description || "",
    });
    setIsEditing(true);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    setIsEditing(false);
    setForm({
      name: workspace?.name || "",
      description: workspace?.description || "",
    });
  }

  async function handleSave() {
    if (!canManageWorkspace) return;
    if (!workspace?.id) return;
    if (!form.name.trim()) return;

    if (
      form.name === workspace?.name &&
      form.description === workspace?.description
    ) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onSave?.(workspace.id, form);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar workspace:", err);
      alert("Erro ao salvar workspace. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!canManageWorkspace) return;
    if (!workspace?.id) return;

    const confirmed = await confirm({
      title: "Excluir workspace",
      message: "Tem certeza que deseja excluir este workspace?",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      setDeleting(true);
      const deleted = await onDelete?.(workspace.id);

      if (deleted !== false) {
        window.location.href = "/groups";
      }
    } catch (err) {
      console.error("Erro ao deletar workspace:", err);
      alert("Erro ao excluir workspace. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="workspace-settings d-flex flex-column gap-4">
      <div className="settings-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="settings-title mb-0">Informações Gerais</h4>

          {!isEditing && canManageWorkspace && (
            <Button
              className="btn-outline-primary btn-sm"
              onClick={startEditing}
            >
              Editar
            </Button>
          )}
        </div>

        <div className="settings-fields">
          <div className="settings-field mb-3">
            <Input
              label="Nome do Workspace"
              value={isEditing ? form.name : workspace?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!isEditing || saving}
            />
          </div>

          <div className="settings-field">
            <Input
              label="Descrição"
              as="textarea"
              rows={3}
              value={
                isEditing ? form.description : workspace?.description || ""
              }
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={!isEditing || saving}
            />
          </div>
        </div>

        {isEditing && (
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-link theme-text-muted text-decoration-none"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </button>

            <Button
              className="btn-color px-4"
              onClick={handleSave}
              disabled={!form.name.trim() || saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </div>

      {canManageWorkspace && (
        <div className="settings-card border border-danger-subtle">
          <h5 className="text-danger mb-2">Zona de Perigo</h5>

          <p className="theme-text-muted mb-3">
            Excluir este workspace removerá permanentemente todos os projetos,
            membros e dados associados. Esta ação não pode ser desfeita.
          </p>

          <Button
            className="btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir Workspace"}
          </Button>
        </div>
      )}
    </div>
  );
}
