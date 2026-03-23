// MemberPermissionsModal.jsx
import { Modal } from "../../../../shared/components/Modal";
import { Button } from "../../../../shared/components/Button";
import { useProjects } from "../../../projects/hooks/useProjects";
import { useProjectMembers } from "../../../projects/hooks/useProjectMembers";

export function MemberPermissionsModal({ show, onClose, member, workspaceId }) {
  const { projects, loadingProjects } = useProjects({ workspaceId });
  const {
    memberProjects,
    loading: loadingPermissions,
    saving,
    changeRole,
    grantAccess,
    removeAccess,
    save,
  } = useProjectMembers(member, workspaceId);

  if (!show || !member) return null;

  return (
    <Modal
      id="modalPermissoes"
      title={`Permissões de ${member.name}`}
      show={show}
      onClose={onClose}
      footer={
        <>
          <button
            className="btn btn-link theme-text-muted text-decoration-none"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <Button className="btn-color px-4" onClick={save} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </>
      }
    >
      <div className="d-flex flex-column gap-3">
        {(loadingProjects || loadingPermissions) && (
          <p className="theme-text-muted">Carregando...</p>
        )}

        {!loadingProjects &&
          !loadingPermissions &&
          projects.map((project) => {
            const role = memberProjects[project.id];

            return (
              <div
                key={project.id}
                className="d-flex justify-content-between align-items-center border rounded p-3"
              >
                <div>
                  <div className="fw-semibold">{project.name}</div>
                  <small className="theme-text-muted">
                    {role ? `Tem acesso (${role})` : "Sem acesso"}
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {role ? (
                    <>
                      <select
                        className="form-select form-select-sm"
                        value={role}
                        onChange={(e) => changeRole(project.id, e.target.value)}
                      >
                        <option value="MANAGER">Manager</option>
                        <option value="CONTRIBUTOR">Contributor</option>
                        <option value="VIEWER">Viewer</option>
                      </select>

                      <Button
                        className="btn-outline-danger btn-sm"
                        onClick={() => removeAccess(project.id)}
                      >
                        Remover
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="btn-outline-primary btn-sm"
                      onClick={() => grantAccess(project.id, "VIEWER")}
                    >
                      Dar acesso
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </Modal>
  );
}
