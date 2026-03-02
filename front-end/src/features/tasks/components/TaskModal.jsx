import { useMemo, useState } from "react";
import { Button } from "../../../shared/components/Button";
import { Modal } from "../../../shared/components/Modal";
import { Input } from "../../../shared/components/Input";
import { createTask } from "../services/taskService";
import { useTaskEnums } from "../hooks/useTaskEnums";

import "../style/modal.css";

export function TaskModal({ projectId, onCreated }) {
  const { statuses, priorities, loading } = useTaskEnums();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("BACKLOG");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

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
      setSaving(true);
      setError(null);
      const payload = {
        projectId,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status,
        dueDateTime: dueDate ? `${dueDate}T00:00:00` : null,
        estimatedTime: estimatedTime || null,
      };
      const created = await createTask(payload);
      if (onCreated) onCreated(created);

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStatus("BACKLOG");
      setDueDate("");
      setEstimatedTime("");

      const el = document.getElementById("modalTask");
      if (el && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(el).hide();
      }
    } catch (e) {
      setError(e.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      id="modalTask"
      title="Nova Tarefa"
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
            {saving ? "Salvando..." : "Criar Tarefa"}
          </Button>
        </>
      }
    >
      {projectId === "ALL" && (
        <div className="project-warning">
          <strong>Atenção:</strong> Selecione um projeto específico na barra
          lateral antes de criar uma tarefa.
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
          label="Título da Tarefa"
          placeholder="Ex: Finalizar protótipo do FlowDesk"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          autoFocus
        />

        <Input
          label="Descrição Detalhada"
          as="textarea"
          rows={3}
          placeholder="Descreva o que precisa ser feito..."
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
              label="Status Inicial"
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
