import { useState } from "react";
import { Plus } from "lucide-react";

import "../../features/tasks/style/tasks.css";

import { ProjectBar } from "../../features/projects/components/ProjectBar";
import { CreateProjectInline } from "../../features/projects/components/CreateProjectInline";

import { Button } from "../../shared/components/Button";
import { TaskModal } from "../../features/tasks/components/TaskModal";
import { TaskBody } from "../../features/tasks/components/TaskBody";

import { useProjects } from "../../features/projects/hooks/useProjects";
import { usePersonalWorkspace } from "../../features/wokspace/hooks/usePersonalWorkspace";
import { useMe } from "../../features/user/hooks/useMe";
import { useProjectTasks } from "../../features/tasks/hooks/useProjectTasks";
import { useWorkspaceTags } from "../../features/wokspace/hooks/useWorkspaceTags";

function PersonalWorkspace() {
  const { usuario, errorMe } = useMe();

  const { workspace, loadingWorkspace, errorWorkspace } =
    usePersonalWorkspace();

  const workspaceId = workspace?.id;

  const {
    projects,
    projectSelecionado,
    setProjectSelecionado,
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
  } = useProjectTasks(projectSelecionado);

  const [editingTaskId, seteditingTaskId] = useState(null);

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const { tags } = useWorkspaceTags(workspaceId);

  function openCreateProject() {
    setIsCreatingProject(true);
  }

  function cancelCreateProject() {
    if (savingProject) return;
    setIsCreatingProject(false);
  }

  async function confirmCreateProject(name) {
    if (savingProject) return;

    const result = await addProject({ name });
    if (!result?.ok) return;

    setIsCreatingProject(false);
  }

  function handleCreatedTask(newTask) {
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleUpdatedTask(updatedTask) {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );

    seteditingTaskId(null);
  }

  function handleDeletedTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function handleEditTask(task) {
    seteditingTaskId(task.id);

    const el = document.getElementById("modalTask");
    if (el && window.bootstrap) {
      window.bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  const erroTela = errorMe || errorWorkspace || errorProjects || errorTasks;

  return (
    <div className="tasks-page">
      <h1>Suas Tarefas{usuario ? `, ${usuario.name}` : ""}</h1>

      {erroTela && <p className="auth-error">{erroTela}</p>}

      <ProjectBar
        projects={projects}
        projectSelecionado={projectSelecionado}
        setProjectSelecionado={setProjectSelecionado}
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
          <p>Carregando workspace...</p>
        </div>
      ) : (
        <TaskBody
          workspaceId={workspaceId}
          projectId={projectSelecionado}
          tasks={tasks}
          loading={loadingTasks}
          error={errorTasks}
          workspaceTags={tags}
          onDeleteTask={handleDeletedTask}
          onEditTask={handleEditTask}
        />
      )}

      <Button
        type="button"
        className="floating-btn btn-color"
        data-bs-toggle="modal"
        data-bs-target="#modalTask"
        onClick={() => seteditingTaskId(null)}
        disabled={projectSelecionado === "ALL" || !projectSelecionado}
      >
        <Plus /> Nova Tarefa
      </Button>

      <TaskModal
        projectId={projectSelecionado}
        taskId={editingTaskId}
        onCreated={handleCreatedTask}
        onUpdated={handleUpdatedTask}
      />
    </div>
  );
}

export default PersonalWorkspace;
