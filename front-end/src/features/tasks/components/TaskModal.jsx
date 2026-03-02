import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Modal } from "../../../shared/components/Modal";
import { Input } from "../../../shared/components/Input";
import { useTask } from "../hooks/useTask";
import { useTaskEnums } from "../hooks/useTaskEnums";

import "../style/modal.css";

export function TaskModal({ projectId, taskId, onCreated, onUpdated }) {
  const { task, createTask, updateTask, saving, error } = useTask(taskId);

  const { statuses, priorities, loading } = useTaskEnums();

  const isEditing = !!taskId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("BACKLOG");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isEditing && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "MEDIUM");
      setStatus(task.status || "BACKLOG");
      setDueDate(task.dueDateTime?.split("T")[0] || "");
      setEstimatedTime(task.estimatedTime || "");
    }
  }, [isEditing, task]);

  const canSave = useMemo(() => {
    return (
      projectId &&
      projectId !== "ALL" &&
      title.trim().length > 0 &&
      !saving &&
      !loading
    );
  }, [projectId, title, saving, loading]);

  async function handleSave() {
    if (!canSave) return;

    try {
      const payload = {
        projectId,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status,
        dueDateTime: dueDate ? `${dueDate}T00:00:00` : null,
        estimatedTime: estimatedTime || null,
      };

      let result;

      if (isEditing) {
        result = await updateTask(payload);
        if (onUpdated) onUpdated(result);
      } else {
        result = await createTask(payload);
        if (onCreated) onCreated(result);
      }

      // Fecha modal
      const el = document.getElementById("modalTask");
      if (el && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(el).hide();
      }

      if (!isEditing) {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setStatus("BACKLOG");
        setDueDate("");
        setEstimatedTime("");
      }
    } catch (e) {
      console.error("Erro ao salvar tarefa:", e);
    }
  }

  return (
    <Modal
      id="modalTask"
      title={isEditing ? "Editar Tarefa" : "Nova Tarefa"}
      footer={
        <>
          <Button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            className="btn-color"
            onClick={handleSave}
            disabled={!canSave}
            style={{ padding: "0.6rem 1.5rem", borderRadius: "10px" }}
          >
            {saving ? "Salvando..." : isEditing ? "Atualizar" : "Criar Tarefa"}
          </Button>
        </>
      }
    >
      {projectId === "ALL" && !isEditing && (
        <div className="project-warning">
          <strong>Atenção:</strong> Selecione um projeto antes de criar.
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger py-2"
          style={{ borderRadius: "10px" }}
        >
          {error}
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          autoFocus
        />

        <Input
          label="Descrição"
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving}
        />

        <div className="row g-3">
          <div className="col-md-6">
            <Input
              label="Prioridade"
              as="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              value={dueDate}
              min={today}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Estimativa"
              placeholder="00:30:00"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              disabled={saving}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
