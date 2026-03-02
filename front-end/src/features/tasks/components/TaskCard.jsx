import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Clock,
  EllipsisVertical,
  Pause,
  Play,
  RotateCcw,
  Square,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../shared/components/Button";
import { useTaskTimer } from "../hooks/useTaskTimer";
import { TaskProgress } from "./TaskProgress";

export function TaskCard({
  task,
  onDelete,
  onEdit,
  activeTaskId,
  setActiveTaskId,
}) {
  const done = task?.status === "DONE";
  const isActive = task?.id === activeTaskId;

  const timer = useTaskTimer(task?.estimatedTime);

  function handlePlayPause() {
    setActiveTaskId(task?.id);
    if (timer.isRunning) return timer.pause();
    if (timer.isPaused) return timer.resume();
    return timer.start();
  }

  function getStatusVisual(status) {
    switch (status) {
      case "BACKLOG":
        return {
          className: "status-backlog",
          icon: <Circle size={14} />,
        };
      case "IN_PROGRESS":
        return {
          className: "status-progress",
          icon: <Play size={14} />,
        };
      case "DONE":
        return {
          className: "status-done",
          icon: <CheckCircle2 size={14} />,
        };
      default:
        return {
          className: "status-default",
          icon: <Circle size={14} />,
        };
    }
  }

  function getPriorityClassName(priority) {
    return `priority-${priority?.toLowerCase() || "default"}`;
  }

  const statusVisual = getStatusVisual(task?.status);

  return (
    <div className={`task-card mt-3 ${isActive ? "task-card--active" : ""}`}>
      <div className="task-row">
        <div className="task-left">
          <div className="task-info">
            <div
              className="task-meta-row"
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                className={`task-priority ${getPriorityClassName(task?.priority)}`}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <AlertTriangle size={12} />
                <span>{task?.priorityDescription}</span>
              </div>

              <div
                className={`task-status ${statusVisual.className}`}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {statusVisual.icon}
                <span>{task?.statusDescription}</span>
              </div>

              {task?.estimatedTime && (
                <div
                  className={`task-time ${timer.isRunning ? "is-running" : ""}`}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Clock size={14} />
                  <span>{timer.timeText}</span>
                </div>
              )}

              <TaskProgress taskId={task.id} />
            </div>

            <div
              className="task-title"
              style={{
                fontSize: "16px",
                fontWeight: "500",
                textDecoration: done ? "line-through" : "none",
                opacity: done ? 0.6 : 1,
              }}
            >
              {task?.title}
            </div>

            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
              Criado por: {task?.createdByName}
            </div>
          </div>
        </div>

        <div
          className="task-actions"
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          {task?.estimatedTime && (
            <>
              <Button
                className={timer.isRunning ? "task-play" : "task-menu"}
                onClick={() => {
                  setActiveTaskId(task?.id);
                  if (timer.isRunning) {
                    timer.pause();
                  } else {
                    timer.start();
                  }
                }}
                title={timer.isRunning ? "Pausar" : "Iniciar"}
              >
                {timer.isRunning ? <Pause size={18} /> : <Play size={18} />}
              </Button>

              <Button
                className="task-menu"
                onClick={timer.restart}
                title="Recomeçar"
              >
                <RotateCcw size={18} />
              </Button>

              <Button className="task-menu" onClick={timer.stop} title="Parar">
                <Square size={18} />
              </Button>
            </>
          )}

          <div className="dropstart">
            <Button
              className="task-menu dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Mais opções"
            >
              <EllipsisVertical size={18} />
            </Button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link to={`/tasks/${task.id}`} className="dropdown-item">
                  Exibir
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => onEdit?.(task)}
                >
                  Editar
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Button
                  className="dropdown-item text-danger"
                  onClick={() => onDelete?.(task)}
                >
                  Excluir
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
