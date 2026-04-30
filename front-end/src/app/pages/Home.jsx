import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListChecks,
  Users,
} from "lucide-react";

import { Topbar } from "../../shared/components/Topbar";
import { Button } from "../../shared/components/Button";
import { useMe } from "../../features/user/hooks/useMe";
import {
  getPersonalWorkspace,
  listWorkspaces,
} from "../../features/wokspace/service/workspaceService";
import { listTasksByWorkspace } from "../../features/tasks/services/taskService";
import { useNotifications } from "../../shared/utils/useNotifications";

const ACTIVE_STATUSES = new Set(["BACKLOG", "TODO", "IN_PROGRESS", "BLOCKED"]);

function formatDate(date) {
  if (!date) return "Sem prazo";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function getTaskPath(task) {
  return `/tasks/${task.id}`;
}

export default function Home() {
  const { user } = useMe();
  const { notifications, acceptInvitation, declineInvitation } = useNotifications();

  const [workspaces, setWorkspaces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [personalResponse, groupsResponse] = await Promise.all([
          getPersonalWorkspace(),
          listWorkspaces(),
        ]);

        if (!alive) return;

        const personalWorkspace = personalResponse?.sucesso
          ? personalResponse.dados
          : null;
        const groupWorkspaces = groupsResponse?.sucesso
          ? groupsResponse.dados || []
          : [];

        const availableWorkspaces = [
          ...(personalWorkspace ? [{ ...personalWorkspace, type: "PERSONAL" }] : []),
          ...groupWorkspaces,
        ];

        setWorkspaces(availableWorkspaces);

        const taskResults = await Promise.allSettled(
          availableWorkspaces.map(async (workspace) => {
            const workspaceTasks = await listTasksByWorkspace(workspace.id);
            return (workspaceTasks || []).map((task) => ({
              ...task,
              workspaceName: workspace.name,
              workspaceType: workspace.type,
              workspaceRole: workspace.role,
            }));
          }),
        );

        if (!alive) return;

        setTasks(
          taskResults
            .filter((result) => result.status === "fulfilled")
            .flatMap((result) => result.value),
        );
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        if (alive) {
          setError(err.message || "Não foi possível carregar o dashboard.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadDashboard();

    function handleInvitationResolved() {
      loadDashboard();
    }

    window.addEventListener("workspace-invitation:resolved", handleInvitationResolved);
    return () => {
      alive = false;
      window.removeEventListener("workspace-invitation:resolved", handleInvitationResolved);
    };
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const completed = tasks.filter((task) => task.status === "DONE").length;
    const active = tasks.filter((task) => ACTIVE_STATUSES.has(task.status)).length;
    const overdue = tasks.filter((task) => {
      if (!task.dueDateTime || task.status === "DONE" || task.status === "CANCELED") {
        return false;
      }
      return new Date(task.dueDateTime).getTime() < now;
    }).length;

    return {
      total: tasks.length,
      completed,
      active,
      overdue,
      groups: workspaces.filter((workspace) => workspace.type === "SHARED").length,
    };
  }, [tasks, workspaces]);

  const pendingInvites = useMemo(
    () =>
      notifications.filter(
        (item) => item.type === "workspace_invite" && item.invitationId,
      ),
    [notifications],
  );

  const actionableTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.status !== "DONE" && task.status !== "CANCELED")
      .sort((a, b) => {
        const aDate = a.dueDateTime ? new Date(a.dueDateTime).getTime() : Infinity;
        const bDate = b.dueDateTime ? new Date(b.dueDateTime).getTime() : Infinity;
        return aDate - bDate;
      })
      .slice(0, 6);
  }, [tasks]);

  const completedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === "DONE")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    [tasks],
  );

  const groupWorkspaces = workspaces.filter((workspace) => workspace.type === "SHARED");

  return (
    <div className="home-dashboard">
      <Topbar breadcrumb={<span className="theme-text">Início</span>} />

      <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 mb-4">
        <div>
          <h1 className="theme-text fw-bold mb-1">Olá, {user?.name || "bem-vindo"}.</h1>
          <p className="theme-text-muted mb-0">
            Seu painel de trabalho com tarefas, grupos e convites em um só lugar.
          </p>
        </div>

        <div className="d-flex gap-2 align-items-start">
          <Link to="/personal" className="btn btn-color">
            Nova tarefa pessoal
          </Link>
          <Link to="/groups" className="btn btn-outline-secondary theme-border">
            Ver grupos
          </Link>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="row g-3 mb-4">
        <MetricCard icon={<ListChecks size={20} />} label="Tarefas" value={stats.total} tone="#3b82f6" />
        <MetricCard icon={<CheckCircle2 size={20} />} label="Concluídas" value={stats.completed} tone="#10b981" />
        <MetricCard icon={<Clock3 size={20} />} label="Em andamento" value={stats.active} tone="#f59e0b" />
        <MetricCard icon={<AlertTriangle size={20} />} label="Atrasadas" value={stats.overdue} tone="#ef4444" />
        <MetricCard icon={<Users size={20} />} label="Grupos" value={stats.groups} tone="#8b5cf6" />
      </div>

      {loading ? (
        <div className="theme-bg-card theme-border border rounded p-4">
          <p className="theme-text-muted mb-0">Carregando seu dashboard...</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-xl-8">
            <section className="theme-bg-card theme-border border rounded p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="theme-text fw-bold mb-1">Tarefas para agir</h5>
                  <small className="theme-text-muted">Acesse direto as próximas entregas.</small>
                </div>
              </div>

              {actionableTasks.length === 0 ? (
                <p className="theme-text-muted mb-0">Nenhuma tarefa pendente no momento.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <tbody>
                      {actionableTasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <div className="fw-semibold theme-text">{task.title}</div>
                            <small className="theme-text-muted">
                              {task.workspaceName} • {task.statusDescription}
                            </small>
                          </td>
                          <td className="text-nowrap theme-text-muted">
                            {formatDate(task.dueDateTime)}
                          </td>
                          <td className="text-end">
                            <Link to={getTaskPath(task)} className="btn btn-sm btn-color">
                              Abrir
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="theme-bg-card theme-border border rounded p-3">
              <h5 className="theme-text fw-bold mb-3">Tarefas concluídas</h5>

              {completedTasks.length === 0 ? (
                <p className="theme-text-muted mb-0">Quando você concluir tarefas, elas aparecem aqui.</p>
              ) : (
                <div className="row g-3">
                  {completedTasks.map((task) => (
                    <div className="col-md-6" key={task.id}>
                      <Link
                        to={getTaskPath(task)}
                        className="d-block text-decoration-none theme-bg-secondary rounded p-3 h-100"
                      >
                        <div className="d-flex justify-content-between gap-2">
                          <div>
                            <div className="fw-semibold theme-text">{task.title}</div>
                            <small className="theme-text-muted">{task.workspaceName}</small>
                          </div>
                          <CheckCircle2 size={18} color="var(--success-color)" />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="col-xl-4">
            <section className="theme-bg-card theme-border border rounded p-3 mb-4">
              <h5 className="theme-text fw-bold mb-3">Convites</h5>

              {pendingInvites.length === 0 ? (
                <p className="theme-text-muted mb-0">Nenhum convite pendente.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {pendingInvites.map((invite) => (
                    <div key={invite.id} className="theme-bg-secondary rounded p-3">
                      <div className="fw-semibold theme-text">
                        {invite.workspaceName || "Workspace"}
                      </div>
                      <small className="theme-text-muted d-block mb-3">
                        {invite.invitedByName || "Alguém"} convidou você.
                      </small>
                      <div className="d-flex gap-2">
                        <Button
                          className="btn-color flex-fill"
                          onClick={() => acceptInvitation(invite.invitationId)}
                        >
                          Aceitar
                        </Button>
                        <Button
                          className="btn-outline-secondary flex-fill"
                          onClick={() => declineInvitation(invite.invitationId)}
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="theme-bg-card theme-border border rounded p-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FolderKanban size={20} className="theme-text-primary" />
                <h5 className="theme-text fw-bold mb-0">Seus grupos</h5>
              </div>

              {groupWorkspaces.length === 0 ? (
                <p className="theme-text-muted mb-0">Você ainda não participa de grupos.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {groupWorkspaces.map((workspace) => (
                    <Link
                      key={workspace.id}
                      to={`/groups/${workspace.id}`}
                      className="d-flex align-items-center justify-content-between text-decoration-none theme-bg-secondary rounded p-3"
                    >
                      <div>
                        <div className="fw-semibold theme-text">{workspace.name}</div>
                        <small className="theme-text-muted">
                          {workspace.memberCount} membro(s) • {workspace.role}
                        </small>
                      </div>
                      <ArrowUpRight size={18} className="theme-text-primary" />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, tone }) {
  return (
    <div className="col-sm-6 col-xl">
      <div className="theme-bg-card theme-border border rounded p-3 h-100">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="theme-text-muted small">{label}</div>
            <div className="theme-text fw-bold fs-3">{value}</div>
          </div>
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: 38,
              height: 38,
              color: tone,
              background: `${tone}18`,
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
