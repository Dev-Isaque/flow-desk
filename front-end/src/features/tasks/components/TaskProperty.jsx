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
          <span className="value priority-badge">{task?.priority}</span>
        </div>
      </div>

      <div className="task-property-item">
        <ClockFading size={18} />
        <div>
          <span className="label">Status</span>
          <span className="value status-badge">{task?.status}</span>
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
          <span className="value">{task?.dueDateTime}</span>
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
            <span
              key={tag.id}
              className="value tag-badge d-flex align-items-center gap-1"
            >
              {tag.name}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => onRemoveTag(tag.id)}
              />
            </span>
          ))}

          {isAdding ? (
            <div className="add-tag-popover p-2 border rounded bg-white shadow-sm mt-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="extra-small fw-bold text-muted">
                  ADICIONAR TAG
                </span>
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => setIsAdding(false)}
                />
              </div>

              <select
                className="form-select form-select-sm mb-2"
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

              <div className="d-flex gap-1">
                <input
                  autoFocus
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ou digite nova..."
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirmInput()}
                  disabled={isProcessing}
                />
                <Button
                  className="btn-primary btn-sm"
                  onClick={handleConfirmInput}
                  disabled={isProcessing || !typedName.trim()}
                >
                  {isProcessing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </Button>
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
