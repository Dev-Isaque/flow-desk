import { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import { useWorkspace } from "../../context/useWorkspace";
import { AddProjectModal } from "../../../projects/components/modals/AddProjectModal";

export function WorkspaceProjects() {
  const {
    projects,
    loadingProjects,
    addProject,
    savingProject,
    handleUpdateProject,
    handleDeleteProject,
  } = useWorkspace();

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="workspace-settings">
      <div className="settings-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Projetos</h3>
            <small className="theme-text-muted">
              Gerencie todos os projetos do workspace.
            </small>
          </div>

          <Button className="btn-color" onClick={() => setShowModal(true)}>
            Novo Projeto
          </Button>
        </div>

        {loadingProjects ? (
          <p className="theme-text-muted">Carregando projetos...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless table-hover align-middle settings-table">
              <thead>
                <tr className="theme-text-muted">
                  <th style={{ width: "50%" }}>PROJETO</th>
                  <th className="text-center">TAREFAS</th>
                  <th className="text-center">MEMBROS</th>
                  <th className="text-center">AÇÕES</th>
                </tr>
              </thead>

              <tbody>
                {projects?.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="fw-semibold text-truncate">
                        {project.name}
                      </div>
                    </td>

                    <td className="text-center">
                      <span className="badge bg-secondary px-3 py-2">
                        {project.tasksCount ?? 0}
                      </span>
                    </td>

                    <td className="text-center">
                      <span className="badge bg-secondary px-3 py-2">
                        {project.membersCount ?? 0}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          className="btn-outline-secondary border-0 px-2"
                          title="Editar Projeto"
                          onClick={() => {
                            const newName = prompt(
                              "Novo nome do projeto:",
                              project.name,
                            );

                            if (!newName || newName.trim() === project.name)
                              return;

                            handleUpdateProject(project.id, {
                              name: newName,
                            });
                          }}
                        >
                          <SquarePen size={16} />
                        </Button>

                        <Button
                          className="btn-outline-danger border-0 px-2"
                          title="Excluir Projeto"
                          onClick={() => {
                            const confirmDelete = window.confirm(
                              `Deseja excluir o projeto "${project.name}"?`,
                            );

                            if (!confirmDelete) return;

                            handleDeleteProject(project.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {projects?.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center theme-text-muted py-4"
                    >
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <AddProjectModal
          show={showModal}
          onAdd={addProject}
          onClose={() => setShowModal(false)}
          saving={savingProject}
        />
      </div>
    </div>
  );
}
