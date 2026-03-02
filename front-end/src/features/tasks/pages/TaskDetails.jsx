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

import { useTask } from "../hooks/useTask";
import { useTaskItems } from "../hooks/useTaskItems";
import { useTaskProgress } from "../hooks/useTaskProgress";
import { useTaskTags } from "../hooks/useTaskTags";

import { Button } from "../../../shared/components/Button";

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const {
    task: initialTask,
    loading: taskLoading,
    deleteTask,
    isDeleting,
  } = useTask(taskId);

  const { progress, reload: reloadProgress } = useTaskProgress(taskId);

  const {
    items,
    loading: itemsLoading,
    error,
    addItem,
    toggleDone,
    remove,
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
    if (deleted) {
      navigate(-1);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (taskLoading) {
    return (
      <div className="container-fluid py-5 text-center">
        <p>Carregando tarefa...</p>
      </div>
    );
  }

  if (!initialTask) {
    return (
      <div className="container-fluid py-5 text-center">
        <p>Tarefa não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 task-details">
      <div className="row">
        <div className="col-lg-8 col-xl-9">
          <div className="m-2">
            <Button className="task-details__back" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
              <span className="ms-1">Voltar</span>
            </Button>
          </div>

{console.log(taskId)}
          <div className="task-details__header">
            <div className="task-hero">
              <div className="task-hero__content">
                <div className="task-hero__info">
                  <h1 className="task-hero__title">
                    {taskWithTags?.title || initialTask.title}
                  </h1>
                  <div className="task-hero__meta">
                    ID: {initialTask.id?.slice(0, 6)} • Criado em{" "}
                    {formatDate(initialTask.createdAt)}, por {initialTask?.name}
                  </div>
                </div>
                <TaskProgress progress={progress} size="hero" showLabel />
              </div>
            </div>
          </div>

          <div className="p-2 mb-3">
            <div className="d-flex align-items-center gap-2 mb-4">
              <FileText />
              <span className="fw-semibold">Descrição</span>
            </div>
            <TaskDescription description={initialTask.description} />
          </div>

          <div className="p-2 mb-4">
            <div className="task-section-header">
              <div className="d-flex align-items-center gap-2">
                <ListCheck size={20} />
                <span className="fw-semibold">Sub-tarefas</span>
              </div>
              <span className="task-remaining-badge">
                {items.filter((i) => !i.done).length} Restantes
              </span>
            </div>
            {itemsLoading && <p>Carregando...</p>}
            {error && <p className="auth-error">{error}</p>}
            {!itemsLoading && !error && (
              <div className="task-details__card card p-3">
                <TaskItemsList
                  items={items}
                  onToggle={handleToggle}
                  onDelete={remove}
                />
              </div>
            )}
            <div className="task-details__card p-4 d-flex gap-2 mt-4">
              <input
                className="form-control"
                placeholder="Novo item do checklist..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={saving}
              />
              <Button
                className="btn-color"
                onClick={handleAdd}
                disabled={!canAdd}
              >
                Adicionar
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
            <Button className="btn-color w-100 p-2">
              <BadgeCheck size={20} />
              <span className="ms-2">Concluir Tarefa</span>
            </Button>
            <Button className="btn-secondary w-100 p-2 mt-2">
              <Share2 size={20} />
              <span className="ms-2">Compartilhar tarefa</span>
            </Button>

            <Button
              className="btn-danger w-100 p-2 mt-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir tarefa"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
