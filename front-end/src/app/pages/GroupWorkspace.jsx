import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Users, Search } from "lucide-react";

import "../../features/tasks/style/tasks.css";
import "../../features/wokspace/style/wokspaces.css";

import { Button } from "../../shared/components/Button";
import { Topbar } from "../../shared/components/Topbar";

import { useSharedWorkspace } from "../../features/wokspace/hooks/useSharedWorkspace";
import { useMe } from "../../features/user/hooks/useMe";

import { WorkspaceBoard } from "../../features/wokspace/components/WorkspaceBoard";
import { WorkspaceCard } from "../../features/wokspace/components/WorkspaceCard";

import { CreateWorkspaceModal } from "../../features/wokspace/components/modals/CreateWorkspaceModal";
import { AddMemberModal } from "../../features/wokspace/components/modals/AddMemberModal";

import { WorkspaceSettings } from "../../features/wokspace/components/WorkspaceSettings";
import { WorkspaceProvider } from "../../features/wokspace/context/WorkspaceProvider";

function GroupWorkspace() {
  const { errorMe } = useMe();

  const {
    workspaces,
    loading,
    error,
    handleAddMember,
    handleCreateWorkspace,
    fetchWorkspaces,
  } = useSharedWorkspace();

  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
    useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const activeWorkspaceId = workspaceId || null;

  const settingsWorkspaceId = location.pathname.includes("settings")
    ? workspaceId
    : null;

  const erroTela = errorMe || error;

  const workspaceAtivo = Array.isArray(workspaces)
    ? workspaces.find((w) => w.id === activeWorkspaceId)
    : null;

  const filteredWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter((workspace) =>
        workspace.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const breadcrumb = settingsWorkspaceId ? (
    <span>
      <span
        onClick={() => navigate(`/groups/${workspaceId}`)}
        className="text-muted hover-primary"
        style={{ cursor: "pointer" }}
      >
        {workspaceAtivo?.name || "Grupo"}
      </span>

      <span className="mx-2 text-muted">{">"}</span>

      <span className="theme-text">Configurações</span>
    </span>
  ) : activeWorkspaceId && workspaceAtivo ? (
    <span>
      <span
        onClick={() => navigate("/groups")}
        className="text-muted hover-primary"
        style={{ cursor: "pointer" }}
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

      {!activeWorkspaceId && (
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
              onClick={() => setShowCreateWorkspaceModal(true)}
            >
              <Plus size={18} className="me-2" />
              Criar Novo Grupo
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
                    onOpen={(id) => navigate(`/groups/${id}`)}
                    onOpenSettings={(id) => navigate(`/groups/${id}/settings`)}
                  />
                </div>
              ))}

              <div className="col-12 col-md-6 col-lg-4">
                <div
                  className="workspace-new-card"
                  onClick={() => setShowCreateWorkspaceModal(true)}
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
      )}

      {/* AREA DO WORKSPACE */}
      {activeWorkspaceId && (
        <WorkspaceProvider workspaceId={activeWorkspaceId}>
          {settingsWorkspaceId ? (
            <WorkspaceSettings
              workspace={workspaceAtivo}
              onBack={() => navigate(`/groups/${workspaceId}`)}
            />
          ) : (
            <WorkspaceBoard
              workspaceId={activeWorkspaceId}
              loadingWorkspace={loading}
              title={workspaceAtivo?.name || "Grupo"}
              onBack={() => navigate("/groups")}
              extraHeaderActions={
                <Button
                  className="btn-color"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  <Users size={18} className="me-2" />
                  Adicionar Membro
                </Button>
              }
            />
          )}
        </WorkspaceProvider>
      )}

      <CreateWorkspaceModal
        show={showCreateWorkspaceModal}
        onCreate={handleCreateWorkspace}
        onClose={() => setShowCreateWorkspaceModal(false)}
      />

      <AddMemberModal
        show={showAddMemberModal}
        workspaceId={activeWorkspaceId}
        onAdd={handleAddMember}
        onClose={() => setShowAddMemberModal(false)}
      />
    </div>
  );
}

export default GroupWorkspace;
