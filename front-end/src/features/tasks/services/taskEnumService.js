import { apiRequest } from "../../api/apiRequest";

export async function getTaskStatuses() {
    const res = await apiRequest('/enums/task-status');

    if (!res.sucesso) {
        throw new Error(res.mensagem || "Erro ao carregar status");
    }

    return res.dados;
}

export async function getTaskPriorities() {
    const res = await apiRequest('/enums/task-priority');

    if (!res.sucesso) {
        throw new Error(res.mensagem || "Erro ao carregar prioridades");
    }

    return res.dados;
}