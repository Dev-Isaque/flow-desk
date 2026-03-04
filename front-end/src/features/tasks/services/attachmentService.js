import { apiRequest } from "../../api/apiRequest";

export async function listAttachments(taskId) {
    const res = await apiRequest(`/tasks/${taskId}/attachments`);

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function uploadAttachment(taskId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiRequest(`/tasks/${taskId}/attachments`, {
        method: "POST",
        body: formData,
    });

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function deleteAttachment(taskId, attachmentId) {
    const res = await apiRequest(
        `/tasks/${taskId}/attachments/${attachmentId}`,
        {
            method: "DELETE",
        }
    );

    if (!res.sucesso) throw new Error(res.mensagem);
}

export async function downloadAttachmentFile(taskId, attachmentId, originalFileName) {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`http://localhost:8080/tasks/${taskId}/attachments/${attachmentId}/download`, {
        method: "GET",
        headers: headers,
    });

    if (!response.ok) {
        throw new Error("Erro ao baixar o arquivo");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", originalFileName);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export async function previewAttachmentFile(taskId, attachmentId) {
    const blob = await apiRequest(
        `/tasks/${taskId}/attachments/${attachmentId}/view`,
        { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
}