import { Trash } from "lucide-react";
import { useEffect } from "react";

export function WorkspaceMembers({
  workspace,
  members,
  fetchMembers,
  handleUpdateMember,
  handleDeleteMember,
}) {
  useEffect(() => {
    if (workspace?.id) {
      fetchMembers(workspace.id);
    }
  }, [workspace?.id]);

  const handleChangeRole = (memberId, newRole) => {
    handleUpdateMember(workspace.id, memberId, newRole);
  };

  return (
    <div className="workspace-settings">
      <div className="settings-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Membros da Equipe</h4>
            <small className="theme-text-muted">
              Gerencie permissões dos membros do workspace
            </small>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle members-table">
            <thead>
              <tr className="theme-text-muted">
                <th>Membro</th>
                <th>Função</th>
                <th>Status</th>
                <th style={{ width: "180px" }}>Permissão</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member, index) => (
                <tr key={index} className="member-row">
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="member-avatar">
                        {member.email[0].toUpperCase()}
                      </div>

                      <div>
                        <div className="fw-semibold">{member.name}</div>

                        <small className="theme-text-muted">
                          {member.email}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`role-badge role-${member.role.toLowerCase()}`}
                    >
                      {member.role}
                    </span>
                  </td>

                  <td>
                    <span className="status-active">● Ativo</span>
                  </td>

                  <td className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto" }} // Garante que o select não ocupe a célula inteira
                      value={member.role}
                      onChange={(e) =>
                        handleChangeRole(member.id, e.target.value)
                      }
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
                    </select>

                    <button
                      className="btn btn-outline-danger btn-sm border-0"
                      onClick={() => handleDeleteMember(workspace.id, member.id)}
                      title="Remover membro"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
