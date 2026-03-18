import { Plus } from "lucide-react";
import { Button } from "../../../shared/components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/projectBar.css";

export function ProjectBar({
  projects = [],
  workspaceRole,
  projectSelecionado,
  isCreatingProject,
  onOpenCreate,
  loadingWorkspace,
  workspaceId,
  loadingProjects,
  savingProject,
  createSlot,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isPersonal = location.pathname.startsWith("/personal");

  function goToProject(projectId) {
    if (isPersonal) {
      if (projectId === "ALL") {
        navigate("/personal");
      } else {
        navigate(`/personal/project/${projectId}`);
      }
    } else {
      if (projectId === "ALL") {
        navigate(`/groups/${workspaceId}`);
      } else {
        navigate(`/groups/${workspaceId}/project/${projectId}`);
      }
    }
  }

  const canCreateProject =
    workspaceRole === "OWNER" || workspaceRole === "ADMIN";

  return (
    <div className="project-bar">
      <Button
        type="button"
        className={`project-tab ${
          projectSelecionado === "ALL" ? "project-tab--active" : ""
        }`}
        onClick={() => goToProject("ALL")}
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
            onClick={() => goToProject(p.id)}
            disabled={savingProject || isCreatingProject}
            title={`Permissão: ${p.role}`}
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
            loadingWorkspace ||
            !workspaceId ||
            loadingProjects ||
            savingProject ||
            !canCreateProject
          }
          title={
            !workspaceId
              ? "Carregando workspace..."
              : !canCreateProject
                ? "Você não tem permissão para criar projetos"
                : "Criar projeto"
          }
        >
          <Plus size={18} />
        </Button>
      ) : (
        createSlot
      )}
    </div>
  );
}
