import { Plus } from "lucide-react";
import { Button } from "../../../shared/components/Button";
import "../style/projectBar.css";

export function ProjectBar({
  projects = [],
  projectSelecionado,
  setProjectSelecionado,
  isCreatingProject,
  onOpenCreate,
  loadingWorkspace,
  workspaceId,
  loadingProjects,
  savingProject,
  createSlot,
}) {
  return (
    <div className="project-bar">
      <Button
        type="button"
        className={`project-tab ${
          projectSelecionado === "ALL" ? "project-tab--active" : ""
        }`}
        onClick={() => setProjectSelecionado("ALL")}
        disabled={savingProject}
      >
        Todas
      </Button>

      {loadingProjects && (
        <span className="project-bar__loading">Carregando projetos...</span>
      )}

      {!loadingProjects &&
        projects.map((p) => (
          <Button
            key={p.id}
            type="button"
            className={`project-tab ${
              projectSelecionado === p.id ? "project-tab--active" : ""
            }`}
            onClick={() => setProjectSelecionado(p.id)}
            disabled={savingProject || isCreatingProject}
          >
            {p.name}
          </Button>
        ))}

      {!isCreatingProject ? (
        <Button
          type="button"
          className="project-add-button"
          onClick={onOpenCreate}
          disabled={
            loadingWorkspace || !workspaceId || loadingProjects || savingProject
          }
          title={!workspaceId ? "Carregando workspace..." : "Criar projeto"}
        >
          <Plus size={18} />
        </Button>
      ) : (
        createSlot
      )}
    </div>
  );
}
