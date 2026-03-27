import { useEffect, useState } from "react";
import {
    getCollaborators,
    addCollaboratorToTask,
    removeCollaboratorFromTask
} from "../services/taskCollaboratorService";

export function useCollaboratorsTask(taskId) {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCollaborators = async () => {
        try {
            setLoading(true);
            const data = await getCollaborators(taskId);
            console.log("getCollaborators retornou:", data);
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
            await addCollaboratorToTask(taskId, userId, role);
            await fetchCollaborators();
        } catch (err) {
            console.error("Erro ao adicionar colaborador", err);
        }
    };

    const removeCollaborator = async (userId) => {
        try {
            await removeCollaboratorFromTask(taskId, userId);
            setCollaborators((prev) =>
                prev.filter((c) => c.user.id !== userId)
            );
        } catch (err) {
            console.error("Erro ao remover colaborador", err);
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
        refresh: fetchCollaborators
    };
}