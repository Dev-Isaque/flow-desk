import { useEffect, useState } from "react";
import {
    getCollaborators,
    addCollaboratorToTask,
    removeCollaboratorFromTask,
    transferTaskOwner
} from "../services/taskCollaboratorService";
import { useToast } from "../../../shared/utils/useToast";

export function useCollaboratorsTask(taskId) {
    const { showToast } = useToast();
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCollaborators = async () => {
        try {
            setLoading(true);
            const data = await getCollaborators(taskId);
            setCollaborators(data?.dados ?? []);
        } catch (err) {
            console.error("Erro ao buscar colaboradores", err);
            setCollaborators([]);
        } finally {
            setLoading(false);
        }
    };

    const addCollaborator = async (userId, role) => {
        try {
            const response = await addCollaboratorToTask(taskId, userId, role);
            if (!response?.sucesso) throw new Error(response?.mensagem);
            await fetchCollaborators();
            showToast("Colaborador atualizado com sucesso.", "success");
        } catch (err) {
            console.error("Erro ao adicionar colaborador", err);
            showToast(err.message || "Erro ao adicionar colaborador.", "error");
        }
    };

    const removeCollaborator = async (userId) => {
        try {
            const response = await removeCollaboratorFromTask(taskId, userId);
            if (!response?.sucesso) throw new Error(response?.mensagem);
            setCollaborators((prev) =>
                prev.filter((c) => (c.user?.id || c.userId) !== userId)
            );
            showToast("Colaborador removido com sucesso.", "success");
        } catch (err) {
            console.error("Erro ao remover colaborador", err);
            showToast(err.message || "Erro ao remover colaborador.", "error");
        }
    };

    const transferOwner = async (userId) => {
        try {
            const response = await transferTaskOwner(taskId, userId);
            if (!response?.sucesso) throw new Error(response?.mensagem);

            await fetchCollaborators();
            showToast("Responsável da tarefa transferido.", "success");
            return true;
        } catch (err) {
            console.error("Erro ao transferir responsável", err);
            showToast(err.message || "Erro ao transferir responsável.", "error");
            return false;
        }
    };

    useEffect(() => {
        if (taskId) {
            fetchCollaborators();
        }
    }, [taskId]);

    return {
        collaborators,
        loading,
        addCollaborator,
        removeCollaborator,
        transferOwner,
        refresh: fetchCollaborators
    };
}
