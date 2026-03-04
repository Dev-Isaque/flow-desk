import { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react"; 

import "../../features/tasks/style/tasks.css";

import { ProjectBar } from "../../features/projects/components/ProjectBar";
import { CreateProjectInline } from "../../features/projects/components/CreateProjectInline";
import { Button } from "../../shared/components/Button";
import { TaskModal } from "../../features/tasks/components/TaskModal";
import { TaskBody } from "../../features/tasks/components/TaskBody";

import { useProjects } from "../../features/projects/hooks/useProjects";
import { useSharedWorkspace } from "../../features/wokspace/hooks/useSharedWorkspace"; 
import { useMe } from "../../features/user/hooks/useMe";
import { useProjectTasks } from "../../features/tasks/hooks/useProjectTasks";
import { useWorkspaceTags } from "../../features/wokspace/hooks/useWorkspaceTags";

function GroupWorkspace() {
  const { usuario, errorMe } = useMe();

  const { workspaces, loading, error, handleAddMember, fetchWorkspaces } =
    useSharedWorkspace();

  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId]);

  const {
    projects,
    projectSelecionado,
    setProjectSelecionado,
    loadingProjects,
    savingProject,
    errorProjects,
    addProject,
  } = useProjects({ workspaceId: activeWorkspaceId });

  const {
    tasks,
    loading: loadingTasks,
    error: errorTasks,
    setTasks,
  } = useProjectTasks(projectSelecionado);

  const [editingTaskId, seteditingTaskId] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { tags } = useWorkspaceTags(activeWorkspaceId);

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
    seteditingTaskId(null);
  }
  function handleDeletedTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }
  function handleEditTask(task) {
    seteditingTaskId(task.id);
    const el = document.getElementById("modalTask");
    if (el && window.bootstrap)
      window.bootstrap.Modal.getOrCreateInstance(el).show();
  }

  const openAddMemberModal = () => {
    const email = prompt("Digite o email do novo membro:");
    if (email) {
      handleAddMember(activeWorkspaceId, email);
    }
  };

  const erroTela = errorMe || error || errorProjects || errorTasks;
  const workspaceAtivo = workspaces.find((w) => w.id === activeWorkspaceId);

  return (
    <div className="tasks-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Equipes{usuario ? `, ${usuario.name}` : ""}</h1>
          {workspaces.length > 0 && (
            <select
              className="form-select mt-2"
              value={activeWorkspaceId}
              onChange={(e) => setActiveWorkspaceId(e.target.value)}
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {activeWorkspaceId && (
          <Button onClick={openAddMemberModal} className="btn-outline-primary">
            <Users size={18} className="me-2" /> Adicionar Membro
          </Button>
        )}
      </div>

      {erroTela && <p className="auth-error">{erroTela}</p>}

      {!activeWorkspaceId && !loading ? (
        <div className="task-body-state">
          <p>Você ainda não participa de nenhum workspace em grupo.</p>
        </div>
      ) : (
        <>
          <ProjectBar
            projects={projects}
            projectSelecionado={projectSelecionado}
            setProjectSelecionado={setProjectSelecionado}
            isCreatingProject={isCreatingProject}
            onOpenCreate={openCreateProject}
            loadingWorkspace={loading}
            workspaceId={activeWorkspaceId}
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

          {loading ? (
            <div className="task-body-state">
              <p>Carregando workspace...</p>
            </div>
          ) : (
            <TaskBody
              workspaceId={activeWorkspaceId}
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
        </>
      )}
    </div>
  );
}

export default GroupWorkspace;
