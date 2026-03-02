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

export function TaskCard({ task, onToggle, onDelete }) {
  const done = task?.status === "DONE";

  const timer = useTaskTimer(task?.estimatedTime);

  async function handleToggle() {
    if (!onToggle) return;

    await onToggle(task);
  }

  function handlePlayPause() {
    if (timer.isRunning) return timer.pause();
    if (timer.isPaused) return timer.resume();
    return timer.start();
  }

  return (
    <div className="task-card">
      <div className="task-row">
        <div className="task-left">
          <Button
            className="task-check p-0 border-0 bg-transparent"
            onClick={handleToggle}
          >
            {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </Button>

          <div className="task-info">
            <div className="task-meta-row">
              {task?.estimatedTime && (
                <div
                  className={`task-time ${timer.isRunning ? "is-running" : ""}`}
                >
                  <Clock size={14} />
                  {timer.timeText}
                </div>
              )}

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
            title="Iniciar/Pausar"
          >
            {timer.isRunning ? <Pause size={18} /> : <Play size={18} />}
          </Button>

          <Button
            className="task-menu p-0 bg-transparent border-0"
            onClick={timer.restart}
            title="Recomeçar"
          >
            <RotateCcw size={18} />
          </Button>

          <Button
            className="task-menu p-0 bg-transparent border-0"
            onClick={timer.stop}
            title="Parar"
          >
            <Square size={18} />
          </Button>

          <div className="dropstart">
            <Button
              className="task-menu p-0 bg-transparent border-0 dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
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
                  className="text-danger"
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
