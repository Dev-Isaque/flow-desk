import { Files, Plus, Trash2, Download, Eye } from "lucide-react";
import { useRef } from "react";
import { useTaskAttachments } from "../hooks/useTaskAttachments";
import { Button } from "../../../shared/components/Button";

export function TaskFiles({ taskId, canUpload, canDelete }) {
  const fileInputRef = useRef(null);

  const { attachments, loading, uploading, upload, remove, download, preview } =
    useTaskAttachments(taskId);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    await upload(file);
    e.target.value = null;
  }

  return (
    <div className="task-properties-card mt-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold d-flex align-items-center gap-2 mb-0">
          <Files size={20} /> Arquivos
        </h5>

        {canUpload && (
          <Button
            className="btn-color btn-sm"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            <Plus size={16} />
          </Button>
        )}
      </div>

      {canUpload && (
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />
      )}

      {loading && <p>Carregando...</p>}

      {!loading && attachments.length === 0 && (
        <p className="text-muted small">Nenhum arquivo enviado.</p>
      )}

      <ul className="list-unstyled mt-3">
        {attachments.map((file) => (
          <li
            key={file.id}
            className="d-flex justify-content-between align-items-center mb-2"
          >
            <span className="text-truncate me-3" style={{ fontSize: "0.9rem" }}>
              {file.originalFileName}
            </span>

            <div className="d-flex gap-2">
              <Button
                className="btn-sm btn-outline-primary"
                onClick={() => preview(file.id)}
                title="Visualizar arquivo"
              >
                <Eye size={14} />
              </Button>
              <Button
                className="btn-sm btn-outline-secondary"
                onClick={() => download(file.id, file.originalFileName)}
                title="Baixar arquivo"
              >
                <Download size={14} />
              </Button>

              {canDelete && (
                <Button
                  className="btn-sm btn-outline-danger"
                  onClick={() => remove(file.id)}
                  title="Excluir arquivo"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
