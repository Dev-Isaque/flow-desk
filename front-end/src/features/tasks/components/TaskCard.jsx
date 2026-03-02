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
} from "lucide-react";
import { Button } from "../../../shared/components/Button";
import { useTaskTimer } from "../hooks/useTaskTimer";
import { TaskProgress } from "./TaskProgress";

export function TaskCard({ task, onDelete, activeTaskId, setActiveTaskId }) {
  const done = task?.status === "DONE";
  const isActive = task?.id === activeTaskId;

  const timer = useTaskTimer(task?.estimatedTime);

  function handlePlayPause() {
    setActiveTaskId(task?.id);
    if (timer.isRunning) return timer.pause();
    if (timer.isPaused) return timer.resume();
    return timer.start();
  }

  function getStatusConfig(status) {
    switch (status) {
      case "BACKLOG":
        return {
          label: "Backlog",
          className: "status-backlog",
          icon: <Circle size={14} />,
        };

      case "IN_PROGRESS":
        return {
          label: "Em andamento",
          className: "status-progress",
          icon: <Play size={14} />,
        };

      case "DONE":
        return {
          label: "Concluída",
          className: "status-done",
          icon: <CheckCircle2 size={14} />,
        };

      default:
        return {
          label: status,
          className: "status-default",
          icon: <Circle size={14} />,
        };
    }
  }

  const statusConfig = getStatusConfig(task?.status);

  return (
    <div className={`task-card mt-3 ${isActive ? "task-card--active" : ""}`}>
      <div className="task-row">
        <div className="task-left">
          <div className="task-info">
            <div className="task-meta-row">
              {task?.estimatedTime && (
                <div
                  className={`task-time ${timer.isRunning ? "is-running" : ""}`}
                >
                  <Clock size={14} />
                  <span>{timer.timeText}</span>
                </div>
              )}

              <div className={`task-status ${statusConfig.className}`}>
                {statusConfig.icon}
                <span>{statusConfig.label}</span>
              </div>

              <TaskProgress taskId={task.id} />
            </div>

            <div
              className="task-title"
              style={{
                textDecoration: done ? "line-through" : "none",
                opacity: done ? 0.6 : 1,
              }}
            >
              {task?.title}
            </div>
          </div>
        </div>

        <div className="task-actions">
          <Button
            className={timer.isRunning ? "task-play" : "task-menu"}
            onClick={handlePlayPause}
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
                <Link to={`/tasks/${task.id}/edit`} className="dropdown-item">
                  Editar
                </Link>
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
