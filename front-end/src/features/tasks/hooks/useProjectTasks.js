import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

import { listTasksByProject } from "../services/taskService";

export function useProjectTasks(projectId) {
    const { showToast } = useToast();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!projectId || projectId === "ALL") {
            setTasks([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await listTasksByProject(projectId);

            setTasks(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);

            const msg = e.message || "Erro ao buscar tarefas do projeto.";

            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }, [projectId, showToast]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        tasks,
        loading,
        error,
        reload: load,
        setTasks,
    };
}