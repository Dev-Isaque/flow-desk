import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "../../../shared/components/Button";

import { useConfirm } from "../../../shared/hooks/useConfirm";

export function TaskItemsList({ items = [], onToggle, onDelete }) {
  const { confirm } = useConfirm();

  if (!items.length) return <p className="mb-0">Nenhum item ainda.</p>;

  return (
    <div className="task-items">
      {items.map((item) => (
        <div
          key={item.id}
          className={`task-item ${item.done ? "is-done" : ""}`}
        >
          <div className="task-item__left">
            <Button
              className="task-item__btn p-0 border-0 bg-transparent"
              onClick={() => onToggle?.(item)}
              title={item.done ? "Marcar como não feito" : "Marcar como feito"}
            >
              {item.done ? (
                <CheckCircle2 size={18} color="var(--success-color)" />
              ) : (
                <Circle size={18} color="var(--text-muted)" />
              )}
            </Button>

            <span className={`task-item__title ${item.done ? "is-done" : ""}`}>
              {item.title}
            </span>

            {item.done && (
              <span className="task-item__badge task-item__badge--done">
                Concluído
              </span>
            )}
          </div>

          <Button
            className="task-item__btn p-0 border-0 bg-transparent"
            onClick={async () => {
              const confirmed = await confirm(
                "Tem certeza que deseja excluir este item?",
              );
              if (confirmed) {
                onDelete?.(item.id);
              }
            }}
            title="Excluir item"
          >
            <Trash2 size={18} color="var(--danger-color)" />
          </Button>
        </div>
      ))}
    </div>
  );
}
