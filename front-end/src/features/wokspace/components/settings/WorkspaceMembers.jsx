import {
  UserRoundMinus,
  SquarePen,
  Check,
  X,
  Search,
  Filter,
  UserPlus,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "../../../../shared/components/Button";

import { AddMemberModal } from "../../components/modals/AddMemberModal";

export function WorkspaceMembers({
  workspace,
  members,
  fetchMembers,
  handleAddMember,
  handleUpdateMember,
  handleDeleteMember,
}) {
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);

  const pageSize = 6;

  useEffect(() => {
    if (workspace?.id) {
      fetchMembers(workspace.id);
    }
  }, [workspace?.id]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === "ALL" ? true : m.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [members, search, roleFilter]);

  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  const paginatedMembers = filteredMembers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleSelectRole = (member) => {
    setEditingMemberId(member.id);
    setSelectedRole(member.role);
  };

  const handleConfirmRole = (memberId) => {
    handleUpdateMember(workspace.id, memberId, selectedRole);
    setEditingMemberId(null);
    setSelectedRole("");
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setSelectedRole("");
  };

  return (
    <div className="workspace-settings">
      <div className="settings-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Membros da Equipe</h3>
            <small className="theme-text-muted">
              Gerencie os membros da sua organização
            </small>
          </div>

          <Button
            className="btn-color d-flex align-items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={18} />
            Convidar Membro
          </Button>
        </div>

        <div className="d-flex gap-3 mb-4">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ maxWidth: "180px" }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle members-table">
            <thead>
              <tr className="theme-text-muted">
                <th>Membro</th>
                <th>Função</th>
                <th>Status</th>
                <th style={{ width: "200px" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {paginatedMembers.map((member) => {
                const isOwner = member.role === "OWNER";
                const isEditing = editingMemberId === member.id;

                return (
                  <tr key={member.id} className="member-row">
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
                      {!isOwner && !isEditing && (
                        <Button
                          className="btn-outline-secondary border-0"
                          onClick={() => handleSelectRole(member)}
                        >
                          <SquarePen size={18} />
                        </Button>
                      )}

                      {!isOwner && isEditing && (
                        <>
                          <select
                            className="form-select form-select-sm"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="MEMBER">Member</option>
                            <option value="VIEWER">Viewer</option>
                          </select>

                          <Button
                            className="btn-success btn-sm"
                            onClick={() => handleConfirmRole(member.id)}
                          >
                            <Check size={16} />
                          </Button>

                          <Button
                            className="btn-secondary btn-sm"
                            onClick={handleCancelEdit}
                          >
                            <X size={16} />
                          </Button>
                        </>
                      )}

                      {!isOwner && !isEditing && (
                        <Button
                          className="btn-outline-danger border-0"
                          onClick={() =>
                            handleDeleteMember(workspace.id, member.id)
                          }
                        >
                          <UserRoundMinus size={18} />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <small className="theme-text-muted">
            Mostrando {paginatedMembers.length} de {filteredMembers.length}{" "}
            membros
          </small>

          <div className="d-flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>

            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próximo
            </Button>
          </div>
        </div>

        <AddMemberModal
          show={showAddModal}
          workspaceId={workspace?.id}
          onAdd={handleAddMember}
          onClose={() => setShowAddModal(false)}
        />
      </div>
    </div>
  );
}
