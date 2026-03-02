import { useMemo, useState } from "react";
import { TaskCard } from "../components/TaskCard";
import { deleteTask as deleteTaskRequest } from "../services/taskService";

export default function ProjectTasks({
  tasks = [],
  loading,
  error,
  workspaceTags = [],
  onDeleteTask,
  onEditTask,
}) {
  const [activeTaskId, setActiveTaskId] = useState(null);

  const orderedTasks = useMemo(() => {
    const list = [...tasks];
    list.sort(
      (a, b) => Number(b.id === activeTaskId) - Number(a.id === activeTaskId),
    );
    return list;
  }, [tasks, activeTaskId]);

  async function handleDelete(task) {
    const confirmed = window.confirm(`Deseja excluir "${task.title}"?`);

    if (!confirmed) return;

    try {
      await deleteTaskRequest(task.id);
      onDeleteTask?.(task.id);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir a tarefa. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <div className="task-list task-list--loading">
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list task-list--error">
        <p className="auth-error">{error}</p>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="task-list task-list--empty">
        <p>Nenhuma tarefa neste projeto</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {orderedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={handleDelete}
          onEdit={onEditTask}
          activeTaskId={activeTaskId}
          setActiveTaskId={setActiveTaskId}
          workspaceTags={workspaceTags}
        />
      ))}
    </div>
  );
}
