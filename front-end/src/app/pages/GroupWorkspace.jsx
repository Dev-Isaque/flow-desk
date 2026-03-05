import { useState, useEffect } from "react";
import { Plus, Users, Search, MoreVertical } from "lucide-react";
import { Modal as BsModal } from "bootstrap";

import "../../features/tasks/style/tasks.css";
import "../../features/wokspace/style/wokspaces.css";

import { Button } from "../../shared/components/Button";
import { Topbar } from "../../shared/components/Topbar";
import { Modal } from "../../shared/components/Modal";
import { useSharedWorkspace } from "../../features/wokspace/hooks/useSharedWorkspace";
import { useMe } from "../../features/user/hooks/useMe";
import { WorkspaceBoard } from "../../features/wokspace/components/WorkspaceBoard";
import { WorkspaceCard } from "../../features/wokspace/components/WorkspaceCard";

function GroupWorkspace() {
  const { user, errorMe } = useMe();
  const {
    workspaces,
    loading,
    error,
    handleAddMember,
    handleCreateWorkspace,
    fetchWorkspaces,
  } = useSharedWorkspace();

  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState("#14b8a6");

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const closeModal = (id) => {
    const modal = BsModal.getInstance(document.getElementById(id));
    if (modal) modal.hide();
  };

  const handleConfirmAddMember = async () => {
    if (newMemberEmail.trim() === "") return;

    await handleAddMember(activeWorkspaceId, newMemberEmail);

    setNewMemberEmail("");
    closeModal("modalMembro");
  };

  const handleConfirmCreateGroup = async () => {
    if (newGroupName.trim() === "") return;

    await handleCreateWorkspace(newGroupName, newGroupColor);

    setNewGroupName("");
    setNewGroupColor("#14b8a6");
    closeModal("modalCriarGrupo");
  };

  const erroTela = errorMe || error;

  const workspaceAtivo = Array.isArray(workspaces)
    ? workspaces.find((w) => w.id === activeWorkspaceId)
    : null;

  const filteredWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter((workspace) =>
        workspace.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const breadcrumb =
    activeWorkspaceId && workspaceAtivo ? (
      <span>
        <span
          onClick={() => setActiveWorkspaceId("")}
          className="text-muted hover-primary"
          style={{ cursor: "pointer", transition: "color 0.2s" }}
        >
          Grupos
        </span>
        <span className="mx-2 text-muted">{">"}</span>
        <span className="theme-text">{workspaceAtivo.name}</span>
      </span>
    ) : (
      <span className="theme-text">Grupos</span>
    );

  return (
    <div className="tasks-page position-relative">
      <Topbar breadcrumb={breadcrumb} />

      {erroTela && <p className="auth-error">{erroTela}</p>}

      {!activeWorkspaceId ? (
        <div className="workspace-dashboard">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h1 className="mb-1 theme-text">Meus Grupos</h1>
              <p className="mb-0 theme-text-muted">
                Gerencie suas equipes e colabore em projetos.
              </p>
            </div>

            <Button
              className="btn-color px-4"
              data-bs-toggle="modal"
              data-bs-target="#modalCriarGrupo"
            >
              <Plus size={18} className="me-2" /> Criar Novo Grupo
            </Button>
          </div>

          <div className="search-bar-container mb-4 position-relative">
            <Search
              size={18}
              className="position-absolute theme-text-muted"
              style={{ left: "15px", top: "12px" }}
            />

            <input
              type="text"
              className="form-control workspace-search-input ps-5 py-2"
              placeholder="Buscar por nome do grupo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="task-body-state">
              <p className="theme-text-muted">Carregando seus grupos...</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredWorkspaces.map((workspace) => (
                <div className="col-12 col-md-6 col-lg-4" key={workspace.id}>
                  <WorkspaceCard
                    workspace={workspace}
                    onOpen={setActiveWorkspaceId}
                  />
                </div>
              ))}

              <div className="col-12 col-md-6 col-lg-4">
                <div
                  className="workspace-new-card"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCriarGrupo"
                >
                  <div className="workspace-new-icon-wrapper">
                    <Plus size={24} />
                  </div>

                  <h5 className="theme-text">Novo Grupo</h5>

                  <p
                    className="theme-text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Crie um novo espaço de trabalho
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <WorkspaceBoard
          workspaceId={activeWorkspaceId}
          loadingWorkspace={loading}
          title={workspaceAtivo?.name || "Grupo"}
          onBack={() => setActiveWorkspaceId("")}
          extraHeaderActions={
            <Button
              className="btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalMembro"
            >
              <Users size={18} className="me-2" /> Adicionar Membro
            </Button>
          }
        />
      )}

      <Modal
        id="modalMembro"
        title="Adicionar Novo Membro"
        footer={
          <>
            <button
              className="btn btn-link theme-text-muted text-decoration-none"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>

            <Button className="btn-color px-4" onClick={handleConfirmAddMember}>
              Adicionar
            </Button>
          </>
        }
      >
        <label className="form-label theme-text-muted fw-medium">
          E-mail do usuário
        </label>

        <input
          className="form-control theme-input"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="exemplo@email.com"
        />
      </Modal>

      <Modal
        id="modalCriarGrupo"
        title="Criar Novo Grupo"
        footer={
          <>
            <button
              className="btn btn-link theme-text-muted text-decoration-none"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>

            <Button
              className="btn-color px-4"
              onClick={handleConfirmCreateGroup}
            >
              Criar Grupo
            </Button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label theme-text-muted fw-medium">
            Nome do Grupo
          </label>

          <input
            className="form-control theme-input"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Nome da equipe"
          />
        </div>

        <div className="d-flex gap-2">
          {["#14b8a6", "#3b82f6", "#8b5cf6", "#f43f5e", "#f59e0b"].map((c) => (
            <div
              key={c}
              onClick={() => setNewGroupColor(c)}
              style={{
                width: 30,
                height: 30,
                backgroundColor: c,
                borderRadius: "50%",
                cursor: "pointer",
                border:
                  newGroupColor === c ? "3px solid var(--text-color)" : "none",
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default GroupWorkspace;
