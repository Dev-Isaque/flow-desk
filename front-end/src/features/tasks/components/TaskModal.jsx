import { useMemo, useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Modal } from "../../../shared/components/Modal";
import { Input } from "../../../shared/components/Input";
import { useTask } from "../hooks/useTask";
import { useTaskEnums } from "../hooks/useTaskEnums";

import "../style/modal.css";

export function TaskModal({
  show,
  onClose,
  projectId,
  task,
  onCreated,
  onUpdated,
}) {
  const { createTask, updateTask, saving, error } = useTask();
  const { statuses, priorities, loading } = useTaskEnums();

  const isEditing = !!task;

  const initialForm = useMemo(
    () => ({
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "MEDIUM",
      status: task?.status || "BACKLOG",
      dueDate: task?.dueDateTime?.split("T")[0] || "",
      estimatedTime: task?.estimatedTime || "",
    }),
    [task],
  );

  const [form, setForm] = useState(initialForm);

  const today = new Date().toISOString().split("T")[0];

  const canSave = useMemo(() => {
    return (
      projectId &&
      projectId !== "ALL" &&
      form.title.trim().length > 0 &&
      !saving &&
      !loading
    );
  }, [projectId, form.title, saving, loading]);

  async function handleSave() {
    if (!canSave) return;

    try {
      const payload = {
        projectId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        status: form.status,
        dueDateTime: form.dueDate ? `${form.dueDate}T00:00:00` : null,
        estimatedTime: form.estimatedTime || null,
      };

      let result;

      if (isEditing) {
        result = await updateTask(task.id, payload);
        onUpdated?.(result);
      } else {
        result = await createTask(payload);
        onCreated?.(result);
      }

      onClose?.();
    } catch (e) {
      console.error("Erro ao salvar tarefa:", e);
    }
  }

  if (!show) return null;

  return (
    <Modal
      key={task?.id || "new"} 
      id="modalTask"
      title={isEditing ? "Editar Tarefa" : "Nova Tarefa"}
      show={show}
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            className="btn btn-light"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            className="btn-color"
            onClick={handleSave}
            disabled={!canSave}
          >
            {saving ? "Salvando..." : isEditing ? "Atualizar" : "Criar Tarefa"}
          </Button>
        </>
      }
    >
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex flex-column gap-3">
        <Input
          label="Título"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          disabled={saving}
          autoFocus
        />

        <Input
          label="Descrição"
          as="textarea"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          disabled={saving}
        />

        <div className="row g-3">
          <div className="col-md-6">
            <Input
              label="Prioridade"
              as="select"
              value={form.priority}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, priority: e.target.value }))
              }
              disabled={saving || loading}
            >
              {priorities.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.description}
                </option>
              ))}
            </Input>
          </div>

          <div className="col-md-6">
            <Input
              label="Status"
              as="select"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              disabled={saving || loading}
            >
              {statuses.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.description}
                </option>
              ))}
            </Input>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <Input
              label="Prazo Final"
              type="date"
              value={form.dueDate}
              min={today}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              disabled={saving}
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Estimativa"
              value={form.estimatedTime}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  estimatedTime: e.target.value,
                }))
              }
              disabled={saving}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
