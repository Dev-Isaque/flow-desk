import { FileText } from "lucide-react";

export function TaskDescription({ description }) {
  if (!description) {
    description = "Nenhuma descrição fornecida para esta tarefa.";
  }

  return (
    <>
      <div className="task-details__card p-3">
        <p>{description}</p>
      </div>
    </>
  );
}
