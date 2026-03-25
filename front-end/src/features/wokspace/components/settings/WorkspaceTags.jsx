import { useState } from "react";
import { Plus, SquarePen } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import { Input } from "../../../../shared/components/Input";
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

const DEFAULT_COLOR = "#64748b";

export function WorkspaceTags() {
  const { tags, createTag, updateTag, deleteTag, loadingTags, creatingTag } =
    useWorkspace();

  const [selectedTag, setSelectedTag] = useState(null);

  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(DEFAULT_COLOR);

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
      color: selectedTag.color,
    });
  }

  function handleStartCreate() {
    setCreatingMode(true);
    setSelectedTag(null);
    setNewTagName("");
    setNewTagColor(DEFAULT_COLOR);
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

    const newTag = await createTag({
      name,
      color: newTagColor,
    });

    if (newTag) {
      setCreatingMode(false);
      setNewTagName("");
      setSelectedTag(newTag);
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

  function handleCancel() {
    setCreatingMode(false);
    setSelectedTag(null);
    setNewTagName("");
    setNewTagColor(DEFAULT_COLOR);
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

        {creatingMode && (
          <div className="mb-4">
            <label className="form-label">Nome da nova tag</label>

            <Input
              className="mb-3"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Digite o nome da tag"
            />

            <label className="form-label">Escolher Cor</label>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {COLORS.map((color) => (
                <div
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: color,
                    cursor: "pointer",
                    border:
                      newTagColor === color
                        ? "3px solid #22d3ee"
                        : "2px solid transparent",
                  }}
                />
              ))}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button
                className="btn-color"
                onClick={handleCreate}
                disabled={creatingTag}
              >
                Criar Tag
              </Button>

              <Button className="btn-outline-secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-borderless table-hover align-middle settings-table">
                <thead>
                  <tr className="theme-text-muted">
                    <th style={{ width: "10%" }} className="text-center">
                      COR
                    </th>
                    <th style={{ width: "50%" }}>NOME DA TAG</th>
                    <th style={{ width: "20%" }} className="text-center">
                      USO
                    </th>
                    <th style={{ width: "20%" }} className="text-center">
                      AÇÕES
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id}>
                      <td className="text-center">
                        <div
                          className="mx-auto"
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: tag.color || DEFAULT_COLOR,
                            border: "2px solid rgba(0,0,0,0.05)",
                          }}
                        />
                      </td>

                      <td>
                        <div className="fw-semibold text-truncate">
                          {tag.name}
                        </div>
                      </td>

                      <td className="text-center">
                        <span className="badge bg-secondary px-3 py-2">
                          {tag.usage ?? 0}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex justify-content-center">
                          <Button
                            className="btn-outline-primary border-0 px-2"
                            onClick={() =>
                              handleSelectTag({
                                ...tag,
                                color: tag.color || DEFAULT_COLOR,
                              })
                            }
                            title="Editar Tag"
                          >
                            <SquarePen size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-4">
            {selectedTag && (
              <div className="tag-editor-card">
                <h5 className="mb-3">Editar Tag</h5>

                <label className="form-label">Nome da Tag</label>

                <Input
                  className="mb-3"
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
                  className="btn-outline-danger w-100 mb-2"
                  onClick={handleDelete}
                >
                  Excluir Tag
                </Button>

                <Button
                  className="btn-outline-secondary w-100"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
