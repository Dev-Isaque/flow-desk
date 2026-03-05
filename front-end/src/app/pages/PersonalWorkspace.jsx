import "../../features/tasks/style/tasks.css";
import { usePersonalWorkspace } from "../../features/wokspace/hooks/usePersonalWorkspace";
import { useMe } from "../../features/user/hooks/useMe";
import { WorkspaceBoard } from "../../features/wokspace/components/WorkspaceBoard";
import { Topbar } from "../../shared/components/Topbar";

function PersonalWorkspace() {
  const { usuario, errorMe } = useMe();
  const { workspace, loadingWorkspace, errorWorkspace } =
    usePersonalWorkspace();

  const erroTela = errorMe || errorWorkspace;

  return (
    <div className="tasks-page position-relative">
      <Topbar breadcrumb={<span className="theme-text">Suas Tarefas</span>} />

      {erroTela && <p className="auth-error">{erroTela}</p>}

      {workspace && (
        <WorkspaceBoard
          workspaceId={workspace.id}
          loadingWorkspace={loadingWorkspace}
          title={`Tarefas de ${usuario ? usuario.name : "..."}`}
        />
      )}
    </div>
  );
}

export default PersonalWorkspace;
