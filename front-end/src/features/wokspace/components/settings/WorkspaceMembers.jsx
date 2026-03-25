import {
  UserRoundMinus,
  SquarePen,
  Check,
  X,
  UserPlus,
  UserCog,
} from "lucide-react";

import { useEffect, useState, useMemo } from "react";
import { Button } from "../../../../shared/components/Button";
import { Input } from "../../../../shared/components/Input";

import { AddMemberModal } from "../../components/modals/AddMemberModal";
import { MemberPermissionsModal } from "../../components/modals/MemberPermissionsModal";

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

  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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

  function openPermissionsModal(member) {
    setSelectedMember(member);
    setShowPermissionsModal(true);
  }

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
            <Input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-start-0"
            />
          </div>

          <select
            as="select"
            className="form-select theme-input"
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
          <table className="table table-borderless table-hover align-middle settings-table">
            <thead>
              <tr className="theme-text-muted">
                <th style={{ width: "60%" }}>Membro</th>
                <th className="text-center" style={{ width: "20%" }}>
                  Função
                </th>
                <th className="text-center" style={{ width: "20%" }}>
                  Status
                </th>
                <th className="text-center" style={{ width: "10%" }}>
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedMembers.map((member) => {
                const isOwner = member.role === "OWNER";
                const isEditing = editingMemberId === member.id;

                return (
                  <tr key={member.id} className="member-row">
                    <td>
                      <div className="member-info d-flex align-items-center gap-3 w-100 overflow-hidden">
                        <div className="member-avatar flex-shrink-0">
                          {member.email[0].toUpperCase()}
                        </div>

                        <div className="member-text overflow-hidden">
                          <div className="fw-semibold text-truncate">
                            {member.name}
                          </div>
                          <small className="theme-text-muted text-truncate d-block">
                            {member.email}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td className="align-middle">
                      <span
                        className={`role-badge role-${member.role.toLowerCase()} d-inline-block w-100 text-center`}
                      >
                        {member.role}
                      </span>
                    </td>

                    <td className="align-middle">
                      <span className="status-active text-nowrap w-100 d-block text-center">
                        ● Ativo
                      </span>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2 w-100">
                        {!isOwner && !isEditing && (
                          <Button
                            className="btn-outline-secondary border-0 flex-fill"
                            onClick={() => handleSelectRole(member)}
                            title="Editar Função"
                          >
                            <SquarePen size={18} />
                          </Button>
                        )}

                        {!isOwner && isEditing && (
                          <>
                            <select
                              className="form-select form-select-sm flex-fill"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="MEMBER">Member</option>
                              <option value="VIEWER">Viewer</option>
                            </select>

                            <Button
                              className="btn-success btn-sm flex-fill"
                              onClick={() => handleConfirmRole(member.id)}
                              title="Confirmar"
                            >
                              <Check size={16} />
                            </Button>

                            <Button
                              className="btn-secondary btn-sm flex-fill"
                              onClick={handleCancelEdit}
                              title="Cancelar"
                            >
                              <X size={16} />
                            </Button>
                          </>
                        )}

                        {!isOwner && !isEditing && (
                          <Button
                            className="btn-outline-primary border-0 flex-fill"
                            onClick={() => openPermissionsModal(member)}
                            title="Permissões"
                          >
                            <UserCog size={18} />
                          </Button>
                        )}
                        
                        {!isOwner && !isEditing && (
                          <Button
                            className="btn-outline-danger border-0 flex-fill"
                            onClick={() =>
                              handleDeleteMember(workspace.id, member.id)
                            }
                            title="Remover Membro"
                          >
                            <UserRoundMinus size={18} />
                          </Button>
                        )}
                      </div>
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
        {selectedMember && (
          <MemberPermissionsModal
            show={showPermissionsModal}
            member={selectedMember}
            workspaceId={workspace?.id}
            onClose={() => {
              setShowPermissionsModal(false);
              setSelectedMember(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
