import AllTasks from "../pages/AllTasks";
import ProjectTasks from "../pages/ProjectTasks";

export function TaskBody({
  workspaceId,
  projectId,
  loadingWorkspace,
  tasks,
  loading,
  error,
  workspaceTags,
  onDeleteTask,
}) {
  if (loadingWorkspace) {
    return (
      <div className="task-body-state">
        <p>Carregando workspace...</p>
      </div>
    );
  }

  if (!workspaceId) {
    return (
      <div className="task-body-state">
        <p>Workspace não encontrado</p>
      </div>
    );
  }

  if (projectId === "ALL") {
    return <AllTasks workspaceId={workspaceId} workspaceTags={workspaceTags} />;
  }

  if (!projectId) {
    return (
      <div className="task-body-state">
        <p>Selecione um projeto</p>
      </div>
    );
  }

  return (
    <ProjectTasks
      tasks={tasks}
      loading={loading}
      error={error}
      workspaceTags={workspaceTags}
      onDeleteTask={onDeleteTask}
    />
  );
}
