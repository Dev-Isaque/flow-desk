import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";

import { ProjectBar } from "../../projects/components/ProjectBar";
import { CreateProjectInline } from "../../projects/components/CreateProjectInline";
import { Button } from "../../../shared/components/Button";
import { TaskModal } from "../../tasks/components/TaskModal";
import { TaskBody } from "../../tasks/components/TaskBody";

import { useProjects } from "../../projects/hooks/useProjects";
import { useProjectTasks } from "../../tasks/hooks/useProjectTasks";
import { useWorkspaceTags } from "../../wokspace/hooks/useWorkspaceTags";
import { useWorkspace } from "../../wokspace/context/useWorkspace";

export function WorkspaceBoard({
  workspaceId,
  title,
  extraHeaderActions,
  loadingWorkspace,
  onBack,
  workspaceRole: propRole,
}) {
  const { projectId } = useParams();

  const selectedProject = projectId || "ALL";

  const { workspaceRole: contextRole } = useWorkspace() || {};
  const workspaceRole = propRole || contextRole;

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const {
    projects,
    loadingProjects,
    savingProject,
    errorProjects,
    addProject,
  } = useProjects({ workspaceId });

  const {
    tasks,
    loading: loadingTasks,
    error: errorTasks,
    setTasks,
  } = useProjectTasks(selectedProject, workspaceId);

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const { tags } = useWorkspaceTags(workspaceId);

  function openCreateProject() {
    setIsCreatingProject(true);
  }

  function cancelCreateProject() {
    if (!savingProject) setIsCreatingProject(false);
  }

  async function confirmCreateProject(name) {
    if (savingProject) return;
    const result = await addProject({ name });
    if (result?.ok) setIsCreatingProject(false);
  }

  function handleCreatedTask(newTask) {
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleUpdatedTask(updatedTask) {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
    setEditingTaskId(null);
  }

  function handleDeletedTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function handleEditTask(task) {
    setEditingTaskId(task.id);
    setShowTaskModal(true);
  }

  const erroTela = errorProjects || errorTasks;
  const workspaceName = typeof title === "string" ? title : "Workspace";

  return (
    <>
      <div className="d-flex justify-content-between align-items-end mb-4 pb-2">
        <div
          className="d-flex align-items-start gap-3"
          style={{ maxWidth: "600px" }}
        >
          {onBack && (
            <button
              onClick={onBack}
              className="btn btn-link theme-text-muted p-0 border-0 hover-primary mt-2"
            >
              <ArrowLeft size={32} />
            </button>
          )}

          <div>
            <h1
              className="fw-bold mb-2 theme-text"
              style={{ fontSize: "2.5rem" }}
            >
              {workspaceName}
            </h1>

            <p className="theme-text-muted mb-0">
              Central de gerenciamento de fluxo de trabalho.
            </p>
          </div>
        </div>

        <div>{extraHeaderActions}</div>
      </div>

      {erroTela && <p className="auth-error">{erroTela}</p>}

      <ProjectBar
        projects={projects}
        workspaceRole={workspaceRole}
        isCreatingProject={isCreatingProject}
        onOpenCreate={openCreateProject}
        loadingWorkspace={loadingWorkspace}
        workspaceId={workspaceId}
        loadingProjects={loadingProjects}
        savingProject={savingProject}
        createSlot={
          <CreateProjectInline
            savingProject={savingProject}
            onConfirm={confirmCreateProject}
            onCancel={cancelCreateProject}
          />
        }
      />

      {loadingWorkspace ? (
        <div className="task-body-state">
          <p className="theme-text-muted">Carregando workspace...</p>
        </div>
      ) : (
        <TaskBody
          workspaceId={workspaceId}
          projectId={selectedProject}
          tasks={tasks}
          loading={loadingTasks}
          error={errorTasks}
          workspaceTags={tags}
          onDeleteTask={handleDeletedTask}
          onEditTask={handleEditTask}
        />
      )}

      {selectedProject !== "ALL" && (
        <Button
          type="button"
          className="floating-btn btn-color"
          onClick={() => {
            setEditingTaskId(null);
            setShowTaskModal(true);
          }}
        >
          <Plus /> Nova Tarefa
        </Button>
      )}

      <TaskModal
        show={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTaskId(null);
        }}
        projectId={selectedProject === "ALL" ? null : selectedProject}
        taskId={editingTaskId}
        onCreated={handleCreatedTask}
        onUpdated={handleUpdatedTask}
      />
    </>
  );
}
