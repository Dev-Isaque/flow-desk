import { apiRequest } from "../../api/apiRequest";

export async function createTask(payload) {
    const res = await apiRequest("/tasks/create", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function updateTask(taskId, payload) {
    const res = await apiRequest(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function deleteTask(taskId) {
    const res = await apiRequest(`/tasks/${taskId}`, {
        method: "DELETE",
    });

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function listTasksByProject(projectId) {
    try {
        const res = await apiRequest(`/projects/${projectId}/tasks`);

        if (!res.sucesso) throw new Error(res.mensagem);

        return res.dados;
    } catch (e) {
        console.error("Erro ao buscar tasks:", e);
        throw e;
    }
}

export async function listTasksByWorkspace(workspaceId) {

    try {
        const res = await apiRequest(`/workspaces/${workspaceId}/tasks`);

        if (!res.sucesso) throw new Error(res.mensagem);
        return res.dados;
    } catch (e) {
        console.error("Erro ao buscar tasks:", e);
        throw e;
    }
}

export async function getTaskProgress(taskId) {
    const res = await apiRequest(`/tasks/${taskId}/progress`);

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function getTaskById(taskId) {
    const res = await apiRequest(`/tasks/${taskId}`);

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function addTagToTask(taskId, tagName) {
    const res = await apiRequest(`/tasks/${taskId}/tags`, {
        method: "POST",
        body: JSON.stringify({ name: tagName }),
    });

    if (!res.sucesso) throw new Error(res.mensagem);
    return res.dados;
}

export async function removeTagFromTask(taskId, tagId) {
    const response = await apiRequest(
        `/tasks/${taskId}/tags/${tagId}`,
        {
            method: "DELETE"
        }
    );

    return response.dados;
}