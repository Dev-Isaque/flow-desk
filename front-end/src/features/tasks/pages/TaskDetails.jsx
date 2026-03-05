import {
  ArrowLeft,
  ListCheck,
  FileText,
  Share2,
  BadgeCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TaskItemsList } from "../components/TaskItemsList";
import { TaskProgress } from "../components/TaskProgress";
import { TaskComment } from "../components/TaskComment";
import { TaskDescription } from "../components/TaskDescription";
import { TaskProperty } from "../components/Taskproperty";
import { TaskFiles } from "../components/TaskFiles";
import { TaskModal } from "../components/TaskModal";

import { useTask } from "../hooks/useTask";
import { useTaskItems } from "../hooks/useTaskItems";
import { useTaskProgress } from "../hooks/useTaskProgress";
import { useTaskTags } from "../hooks/useTaskTags";

import { Button } from "../../../shared/components/Button";
import { formatDate } from "../../../shared/utils/formatDate";

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const {
    task: initialTask,
    loading: taskLoading,
    deleteTask,
    updateTask,
    isDeleting,
    saving: taskSaving,
  } = useTask(taskId);

  const { progress, reload: reloadProgress } = useTaskProgress(taskId);

  const {
    items,
    loading: itemsLoading,
    error,
    addItem,
    toggleDone,
    remove,
    allItemsDone,
  } = useTaskItems(taskId);

  const {
    taskWithTags,
    workspaceTags,
    associateTag,
    removeTag,
    isProcessing,
    loadingTags,
  } = useTaskTags(initialTask, initialTask?.workspaceId);

  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const canAdd = useMemo(
    () => newTitle.trim().length > 0 && !saving,
    [newTitle, saving],
  );

  async function handleAdd() {
    if (!canAdd) return;
    try {
      setSaving(true);
      await addItem({ title: newTitle.trim() });
      setNewTitle("");
      await reloadProgress();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(item) {
    await toggleDone(item.id, !item.done);
    await reloadProgress();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta tarefa?",
    );
    if (!confirmed) return;

    const deleted = await deleteTask();
    if (deleted) navigate("/personal");
  }

  async function handleCompleteTask() {
    try {
      if (initialTask?.status === "DONE") {
        await updateTask({ status: "IN_PROGRESS" });
        return;
      }
      if (!allItemsDone) {
        alert("Complete todas as subtarefas antes de concluir.");
        return;
      }
      await updateTask({ status: "DONE" });
    } catch (error) {
      alert("Não foi possível atualizar a tarefa: " + error.message);
    }
  }

  function handleEdit() {
    setShowEditModal(true);
  }

  if (taskLoading) {
    return (
      <div className="container-fluid py-5 text-center theme-text-muted">
        <p>Carregando tarefa...</p>
      </div>
    );
  }

  if (!initialTask) {
    return (
      <div className="container-fluid py-5 text-center theme-text">
        <p>Tarefa não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 task-details">
      <div className="row">
        <div className="col-lg-8 col-xl-9">
          <div className="m-2">
            <Button
              className="task-details__back theme-text-muted"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              <span className="ms-1">Voltar</span>
            </Button>
          </div>

          <div className="task-details__header">
            <div className="task-hero theme-bg-card theme-border">
              <div className="task-hero__content">
                <div className="task-hero__info">
                  <h1 className="task-hero__title theme-text">
                    {taskWithTags?.title || initialTask.title}
                  </h1>
                  <div className="task-hero__meta theme-text-muted">
                    ID: {initialTask.id?.slice(0, 6)} • Criado em{" "}
                    {formatDate(initialTask.createdAt)}, por {initialTask?.name}
                  </div>
                </div>
                <TaskProgress progress={progress} size="hero" showLabel />
              </div>
            </div>
          </div>

          <div className="p-2 mb-3">
            <div className="d-flex align-items-center gap-2 mb-4 theme-text">
              <FileText size={20} />
              <span className="fw-semibold">Descrição</span>
            </div>
            <div className="theme-text">
              <TaskDescription description={initialTask.description} />
            </div>
          </div>

          <div className="p-2 mb-4">
            <div className="task-section-header">
              <div className="d-flex align-items-center gap-2 theme-text">
                <ListCheck size={20} />
                <span className="fw-semibold">Sub-tarefas</span>
              </div>
              <span className="task-remaining-badge theme-bg-secondary theme-text-primary">
                {items.filter((i) => !i.done).length} Restantes
              </span>
            </div>

            {itemsLoading && <p className="theme-text-muted">Carregando...</p>}
            {error && <p className="auth-error">{error}</p>}

            {!itemsLoading && !error && (
              <div className="task-details__card theme-bg-card theme-border p-3">
                <TaskItemsList
                  items={items}
                  onToggle={handleToggle}
                  onDelete={remove}
                />
              </div>
            )}

            <div className="task-details__card theme-bg-card theme-border p-4 d-flex gap-2 mt-4">
              <input
                className="form-control theme-input"
                placeholder="Novo item do checklist..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={saving}
              />
              <Button
                className="btn-color px-4"
                onClick={handleAdd}
                disabled={!canAdd}
              >
                {saving ? "..." : "Adicionar"}
              </Button>
            </div>
          </div>

          <div className="p-2 mb-3">
            <TaskComment taskId={taskId} />
          </div>
        </div>

        <div className="col-lg-4 col-xl-3">
          <TaskProperty
            task={taskWithTags || initialTask}
            workspaceTags={workspaceTags}
            onAddTag={associateTag}
            onRemoveTag={removeTag}
            isProcessing={isProcessing}
            loadingTags={loadingTags}
          />

          <TaskFiles taskId={taskId} />

          <div className="d-flex flex-column gap-2 mt-4 mb-3">
            <Button
              className={`w-100 p-2 ${
                initialTask?.status === "DONE" ? "btn-success" : "btn-color"
              }`}
              onClick={handleCompleteTask}
              disabled={taskSaving}
            >
              <BadgeCheck size={20} />
              <span className="ms-2">
                {initialTask?.status === "DONE"
                  ? "Tarefa Concluída"
                  : "Concluir Tarefa"}
              </span>
            </Button>

            <Button
              className="btn btn-link theme-text-muted text-decoration-none border theme-border w-100 p-2"
              onClick={handleEdit}
            >
              Editar Detalhes
            </Button>

            <Button className="btn btn-link theme-text-muted text-decoration-none border theme-border w-100 p-2">
              <Share2 size={18} className="me-2" />
              Compartilhar
            </Button>

            <hr className="my-2 theme-border" />

            <Button
              className="btn btn-danger w-100 p-2 opacity-75 hover-opacity-100"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir tarefa"}
            </Button>
          </div>
        </div>
      </div>

      <TaskModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        projectId={initialTask.workspaceId}
        onUpdated={() => {
          setShowEditModal(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
