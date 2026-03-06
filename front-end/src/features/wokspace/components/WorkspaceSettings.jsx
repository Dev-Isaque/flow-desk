import { useState } from "react";

import { WorkspaceGeneral } from "./settings/WorkspaceGeneral";
import { WorkspaceMembers } from "./settings/WorkspaceMembers";
import { WorkspaceTags } from "./settings/WorkspaceTags";
import { WorkspacePermissions } from "./settings/WorkspacePermissions";

import { Button } from "../../../shared/components/Button";

export function WorkspaceSettings({ workspaceId, onBack }) {
  const [activeTab, setActiveTab] = useState();

  const screnns = {
    general: <WorkspaceGeneral workspaceId={workspaceId} />,
    members: <WorkspaceMembers workspaceId={workspaceId} />,
    tags: <WorkspaceTags workspaceId={workspaceId} />,
    permissions: <WorkspacePermissions workspaceId={workspaceId} />,
  };

  function handleRenderingView(screenName) {
    setActiveTab(screenName);
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
            ></Button>
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
          <Button className="btn-color" onClick={() => handleRenderingView("general")}>Geral</Button>

          <Button className="btn-color" onClick={() => handleRenderingView("members")}>
            Membros
          </Button>

          <Button className="btn-color" onClick={() => handleRenderingView("tags")}>
            Tags/Etiquetas
          </Button>

          <Button className="btn-color" onClick={() => handleRenderingView("permissions")}>
            Permissões
          </Button>
        </div>
      </div>

      <div className="conteudo-da-view">{screnns[activeTab]}</div>

      {}

      {/*       <Button
        onClick={onBack}
        className="btn btn-sm btn-outline-secondary mb-3"
      >
        Voltar
      </Button> */}
    </div>
  );
}
