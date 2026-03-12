import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import { useWorkspace } from "../../context/useWorkspace";

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

export function WorkspaceTags() {
  const { tags, createTag, updateTag, deleteTag, loadingTags, creatingTag } =
    useWorkspace();

  const [selectedTag, setSelectedTag] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [creatingMode, setCreatingMode] = useState(false);

  function handleSelectTag(tag) {
    setSelectedTag(tag);
    setCreatingMode(false);
  }

  function handleChangeName(name) {
    setSelectedTag((prev) => (prev ? { ...prev, name } : prev));
  }

  function handleChangeColor(color) {
    setSelectedTag((prev) => (prev ? { ...prev, color } : prev));
  }

  async function handleSave() {
    if (!selectedTag) return;

    const alreadyExists = tags.some(
      (t) =>
        t.name.toLowerCase() === selectedTag.name.toLowerCase() &&
        t.id !== selectedTag.id,
    );

    if (alreadyExists) {
      alert("Já existe uma tag com esse nome.");
      return;
    }

    await updateTag(selectedTag.id, {
      name: selectedTag.name,
    });
  }

  function handleStartCreate() {
    setCreatingMode(true);
    setSelectedTag(null);
    setNewTagName("");
  }

  async function handleCreate() {
    const name = newTagName.trim();

    if (!name) {
      alert("Digite um nome para a tag.");
      return;
    }

    const alreadyExists = tags.some(
      (t) => t.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyExists) {
      alert("Já existe uma tag com esse nome.");
      return;
    }

    const newTag = await createTag(name);

    if (newTag) {
      setCreatingMode(false);
      setNewTagName("");
      setSelectedTag({ ...newTag, color: "#64748b" });
    }
  }

  async function handleDelete() {
    if (!selectedTag) return;

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta tag?",
    );

    if (!confirmDelete) return;

    await deleteTag(selectedTag.id);
    setSelectedTag(null);
  }

  if (loadingTags) {
    return (
      <div className="workspace-settings">
        <p className="theme-text-muted">Carregando tags...</p>
      </div>
    );
  }

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

          <Button
            className="btn-color"
            onClick={handleStartCreate}
            disabled={creatingTag || creatingMode}
          >
            <Plus size={18} className="me-2" />
            Adicionar Nova Tag
          </Button>
        </div>

        {/* CAMPO DE CRIAÇÃO */}
        {creatingMode && (
          <div className="mb-4">
            <label className="form-label">Nome da nova tag</label>

            <div className="d-flex gap-2">
              <input
                className="form-control"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Digite o nome da tag"
              />

              <Button
                className="btn-color"
                onClick={handleCreate}
                disabled={creatingTag}
              >
                Criar
              </Button>
            </div>
          </div>
        )}

        <div className="row g-4">
          {/* LISTA DE TAGS */}
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-borderless align-middle tags-table">
                <thead>
                  <tr className="theme-text-muted">
                    <th>COR</th>
                    <th>NOME DA TAG</th>
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
                            background: tag.color || "#64748b",
                          }}
                        />
                      </td>

                      <td className="fw-medium">{tag.name}</td>

                      <td>
                        <button
                          className="btn btn-link text-info"
                          onClick={() =>
                            handleSelectTag({
                              ...tag,
                              color: tag.color || "#64748b",
                            })
                          }
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
                <h5 className="mb-3">Editar Tag</h5>

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

                <Button
                  className="btn-outline-danger w-100"
                  onClick={handleDelete}
                >
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
