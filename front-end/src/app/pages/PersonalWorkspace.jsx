import "../../features/tasks/style/tasks.css";

import { usePersonalWorkspace } from "../../features/wokspace/hooks/usePersonalWorkspace";
import { useMe } from "../../features/user/hooks/useMe";

import { WorkspaceBoard } from "../../features/wokspace/components/WorkspaceBoard";
import { WorkspaceProvider } from "../../features/wokspace/context/WorkspaceProvider";

import { Topbar } from "../../shared/components/Topbar";

function PersonalWorkspace() {
  const { usuario, errorMe } = useMe();

  const { workspace, loadingWorkspace, errorWorkspace } =
    usePersonalWorkspace();

  const erroTela = errorMe || errorWorkspace;

  return (
    <div className="tasks-page position-relative">
      <Topbar
        breadcrumb={<span className="theme-text">Suas Tarefas</span>}
        workspaceRole="OWNER"
      />

      {erroTela && <p className="auth-error">{erroTela}</p>}

      {workspace && (
        <WorkspaceProvider workspaceId={workspace.id}>
          <WorkspaceBoard
            workspaceId={workspace.id}
            workspace={workspace}
            loadingWorkspace={loadingWorkspace}
            title={`Tarefas de ${usuario ? usuario.name : "..."}`}
          />
        </WorkspaceProvider>
      )}
    </div>
  );
}

export default PersonalWorkspace;
