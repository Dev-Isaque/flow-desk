import {
  ClockFading,
  UserRound,
  TriangleAlert,
  CalendarDays,
  Plus,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "../../../shared/components/Button";
import { formatDate } from "../../../shared/utils/formatDate";

export function TaskProperty({
  task,
  workspaceTags = [],
  onAddTag,
  onRemoveTag,
  isProcessing,
  loadingTags,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [typedName, setTypedName] = useState("");

  const availableOptions = useMemo(() => {
    const currentTagIds = new Set(task?.tags?.map((t) => t.id) || []);
    return workspaceTags.filter((wTag) => !currentTagIds.has(wTag.id));
  }, [workspaceTags, task?.tags]);

  const handleConfirmInput = async () => {
    if (typedName.trim()) {
      await onAddTag(typedName.trim());
      setTypedName("");
      setIsAdding(false);
    }
  };

  const handleSelectExisting = async (e) => {
    const selectedName = e.target.value;
    if (selectedName) {
      await onAddTag(selectedName);
      setIsAdding(false);
    }
  };

  return (
    <div className="task-properties-card p-4">
      <h6 className="task-properties-title mb-4">PROPRIEDADES</h6>

      <div className="task-property-item">
        <TriangleAlert size={18} />
        <div>
          <span className="label">Prioridade</span>
          <span
            className={`value priority-badge priority-${task?.priority?.toLowerCase()}`}
          >
            {task?.priorityDescription || "Não definida"}
          </span>
        </div>
      </div>

      <div className="task-property-item">
        <ClockFading size={18} />
        <div>
          <span className="label">Status</span>
          <span
            className={`value status-badge status-${task?.status?.toLowerCase()}`}
          >
            {task?.statusDescription || "Sem status"}
          </span>
        </div>
      </div>

      <div className="task-property-item">
        <UserRound size={18} />
        <div>
          <span className="label">Responsável</span>
          <span className="value">{task?.createdByName}</span>
        </div>
      </div>

      <div className="task-property-item">
        <CalendarDays size={18} />
        <div>
          <span className="label">Entrega</span>
          <span className="value">{formatDate(task?.dueDateTime)}</span>
        </div>
      </div>

      <hr />

      <div className="task-tag-section">
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <span className="label">Tags</span>
          {loadingTags && (
            <Loader2 size={14} className="animate-spin text-muted" />
          )}
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          {task?.tags?.map((tag) => (
            <span key={tag.id} className="tag-badge">
              <span>#{tag.name}</span>

              {onRemoveTag && (
                <span
                  className="remove-btn"
                  onClick={() => onRemoveTag(tag.id)}
                >
                  <X size={10} />
                </span>
              )}
            </span>
          ))}

          {onAddTag && isAdding ? (
            <div className="add-tag-popover mt-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span
                  className="fw-semibold theme-text-muted"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  ADICIONAR TAG
                </span>

                <X
                  size={14}
                  className="cursor-pointer theme-text-muted"
                  onClick={() => setIsAdding(false)}
                />
              </div>

              <select
                className="theme-input mb-2"
                onChange={handleSelectExisting}
                defaultValue=""
                disabled={isProcessing}
              >
                <option value="" disabled>
                  Selecionar existente...
                </option>
                {availableOptions.map((tag) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>

              <div
                className="text-center theme-text-muted mb-2"
                style={{ fontSize: "11px" }}
              >
                ou
              </div>

              <div className="d-flex gap-1">
                <input
                  autoFocus
                  type="text"
                  className="theme-input"
                  placeholder="Nova tag..."
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirmInput()}
                  disabled={isProcessing}
                />

                <button
                  className="btn-color d-flex align-items-center justify-content-center"
                  onClick={handleConfirmInput}
                  disabled={isProcessing || !typedName.trim()}
                  style={{ width: "34px", height: "34px", padding: 0 }}
                >
                  {isProcessing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <Button
              className="btn-secondary btn-sm rounded-circle"
              onClick={() => setIsAdding(true)}
              disabled={isProcessing}
              style={{ width: "28px", height: "28px", padding: 0 }}
            >
              <Plus size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
