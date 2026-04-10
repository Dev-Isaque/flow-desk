import { useState } from "react";
import { Plus, CheckCircle2, Folder } from "lucide-react";

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");

  const recentTasks = [
    {
      id: 1,
      title: "Revisar protótipos de UI",
      status: "Em progresso",
      priority: "Alta",
    },
    {
      id: 2,
      title: "Atualizar documentação",
      status: "Pendente",
      priority: "Média",
    },
    {
      id: 3,
      title: "Implementar autenticação",
      status: "Em progresso",
      priority: "Alta",
    },
    {
      id: 4,
      title: "Testes de integração",
      status: "Concluído",
      priority: "Média",
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "Concluído") return "bg-success-subtle text-success";
    if (status === "Em progresso") return "bg-primary-subtle text-primary";
    return "bg-warning-subtle text-warning";
  };

  const getPriorityBadge = (priority) => {
    return priority === "Alta"
      ? "bg-danger-subtle text-danger"
      : "bg-info-subtle text-info";
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <main className="flex-grow-1 overflow-auto">
        <div className="container py-4">
          {/* Welcome */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
            <div>
              <h2 className="fw-bold">Olá, Alex 👋</h2>
              <p className="text-muted">
                Aqui está o resumo do que está acontecendo no FlowDesk hoje.
              </p>
            </div>

            <button className="btn btn-primary d-flex align-items-center gap-2">
              <Plus size={18} />
              Nova Tarefa
            </button>
          </div>

          {/* Dashboard */}
          <div className="row g-4">
            {/* LEFT */}
            <div className="col-xl-8">
              {/* Recent Tasks */}
              <div className="card shadow-sm mb-4">
                <div className="card-header d-flex justify-content-between">
                  <h5 className="mb-0 fw-bold">Tarefas Recentes</h5>
                  <button className="btn btn-link p-0 text-decoration-none">
                    Ver todas
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Tarefa</th>
                        <th>Status</th>
                        <th>Prioridade</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.title}</td>

                          <td>
                            <span
                              className={`badge ${getStatusBadge(task.status)}`}
                            >
                              {task.status}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge ${getPriorityBadge(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </td>

                          <td>
                            <button className="btn btn-sm btn-link text-primary">
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-xl-4">
              {/* Quick Actions */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Início Rápido</h5>

                  <div className="d-grid gap-2">
                    <button className="btn btn-primary d-flex align-items-center gap-2">
                      <Plus size={18} />
                      Nova Tarefa
                    </button>

                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                      <Folder size={18} />
                      Novo Projeto
                    </button>

                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                      <CheckCircle2 size={18} />
                      Meus Objetivos
                    </button>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Membros da Equipe</h5>

                  {[
                    { name: "Ana Costa", role: "Designer" },
                    { name: "Bruno Silva", role: "Developer" },
                    { name: "Carlos Oliveira", role: "Product Manager" },
                  ].map((member, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-3">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                        style={{ width: 32, height: 32, fontSize: 12 }}
                      >
                        {member.name.charAt(0)}
                      </div>

                      <div>
                        <div className="fw-semibold">{member.name}</div>
                        <small className="text-muted">{member.role}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
