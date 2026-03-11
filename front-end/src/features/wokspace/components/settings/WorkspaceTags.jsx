import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/Button";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#64748b",
  "#f97316",
  "#06b6d4",
];

export function WorkspaceTags({ workspace }) {
  const [tags, setTags] = useState([
    { id: 1, name: "Urgente", color: "#ef4444", usage: 42 },
    { id: 2, name: "Em Revisão", color: "#f59e0b", usage: 18 },
    { id: 3, name: "Aguardando", color: "#3b82f6", usage: 25 },
    { id: 4, name: "Concluído", color: "#10b981", usage: 156 },
  ]);

  const [selectedTag, setSelectedTag] = useState(null);

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
  };

  const handleChangeName = (name) => {
    setSelectedTag({ ...selectedTag, name });
  };

  const handleChangeColor = (color) => {
    setSelectedTag({ ...selectedTag, color });
  };

  const handleSave = () => {
    setTags((prev) =>
      prev.map((t) => (t.id === selectedTag.id ? selectedTag : t)),
    );
  };

  return (
    <div className="workspace-settings">
      <div className="settings-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Gerenciar Etiquetas</h3>
            <small className="theme-text-muted">
              Organize seus fluxos de trabalho com tags personalizadas.
            </small>
          </div>

          <Button className="btn-color">
            <Plus size={18} className="me-2" />
            Adicionar Nova Tag
          </Button>
        </div>

        <div className="row g-4">
          {/* LISTA DE TAGS */}
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-borderless align-middle tags-table">
                <thead>
                  <tr className="theme-text-muted">
                    <th>COR</th>
                    <th>NOME DA TAG</th>
                    <th>USO</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>

                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id}>
                      <td>
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: tag.color,
                          }}
                        />
                      </td>

                      <td className="fw-medium">{tag.name}</td>

                      <td>
                        <span className="badge bg-secondary">
                          {tag.usage} tarefas
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-link text-info"
                          onClick={() => handleSelectTag(tag)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDITOR */}
          <div className="col-lg-4">
            {selectedTag && (
              <div className="tag-editor-card">
                <h5 className="mb-3">Editar Tag Selecionada</h5>

                <label className="form-label">Nome da Tag</label>

                <input
                  className="form-control mb-3"
                  value={selectedTag.name}
                  onChange={(e) => handleChangeName(e.target.value)}
                />

                <label className="form-label">Escolher Cor</label>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {COLORS.map((color) => (
                    <div
                      key={color}
                      onClick={() => handleChangeColor(color)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: color,
                        cursor: "pointer",
                        border:
                          selectedTag.color === color
                            ? "3px solid #22d3ee"
                            : "2px solid transparent",
                      }}
                    />
                  ))}
                </div>

                <Button className="btn-color w-100 mb-2" onClick={handleSave}>
                  Salvar Alterações
                </Button>

                <Button className="btn-outline-danger w-100">
                  Excluir Tag
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
