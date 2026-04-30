import { useParams, useNavigate } from "react-router-dom";

import { WorkspaceGeneral } from "./settings/WorkspaceGeneral";
import { WorkspaceMembers } from "./settings/WorkspaceMembers";
import { WorkspaceTags } from "./settings/WorkspaceTags";
import { WorkspaceProjects } from "./settings/WorkspaceProjects";

import { Button } from "../../../shared/components/Button";
import { useWorkspace } from "../context/useWorkspace";

export function WorkspaceSettings({ workspace, onBack }) {
  const {
    members,
    fetchMembers,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
    handleUpdateWorkspace,
    handleDeleteWorkspace,
  } = useWorkspace();

  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab = tab || "general";
  const isWorkspaceOwner = workspace?.role === "OWNER";

  const screens = {
    general: (
      <WorkspaceGeneral
        workspace={workspace}
        onSave={handleUpdateWorkspace}
        onDelete={handleDeleteWorkspace}
        canManageWorkspace={isWorkspaceOwner}
      />
    ),

    members: (
      <WorkspaceMembers
        workspace={workspace}
        members={members}
        fetchMembers={fetchMembers}
        handleAddMember={handleAddMember}
        handleUpdateMember={handleUpdateMember}
        handleDeleteMember={handleDeleteMember}
        canManageMembers={isWorkspaceOwner}
      />
    ),

    projects: <WorkspaceProjects workspace={workspace} />,

    tags: <WorkspaceTags workspace={workspace} />,
  };

  function handleRenderingView(screenName) {
    navigate(`/groups/${workspace.id}/settings/${screenName}`);
  }

  return (
    <div className="workspace-settings">
      <div className="d-flex justify-content-between align-items-end mb-4 pb-2">
        <div
          className="d-flex align-items-start gap-3"
          style={{ maxWidth: "600px" }}
        >
          {onBack && (
            <Button
              onClick={onBack}
              className="btn btn-link theme-text-muted p-0 border-0 hover-primary mt-2"
              style={{ transition: "color 0.2s" }}
              title="Voltar"
            />
          )}

          <div>
            <h1
              className="fw-bold mb-2 theme-text"
              style={{ fontSize: "2.5rem" }}
            >
              Configurações do Workspace
            </h1>

            <p
              className="theme-text-muted mb-0"
              style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
            >
              Central de gerenciamento de fluxo de trabalho.
            </p>
          </div>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-center mb-4">
        <div className="settings-tabs">
          <Button
            className={`btn-color ${activeTab === "general" ? "active" : ""}`}
            onClick={() => handleRenderingView("general")}
          >
            Geral
          </Button>

          <Button
            className={`btn-color ${activeTab === "members" ? "active" : ""}`}
            onClick={() => handleRenderingView("members")}
          >
            Membros
          </Button>

          <Button
            className={`btn-color ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => handleRenderingView("projects")}
          >
            Projetos
          </Button>

          <Button
            className={`btn-color ${activeTab === "tags" ? "active" : ""}`}
            onClick={() => handleRenderingView("tags")}
          >
            Tags/Etiquetas
          </Button>
        </div>
      </div>

      <div className="conteudo-da-view">
        {screens[activeTab] || screens.general}
      </div>
    </div>
  );
}
