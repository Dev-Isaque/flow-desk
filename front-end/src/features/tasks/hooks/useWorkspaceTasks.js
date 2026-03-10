import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

import { listTasksByWorkspace } from "../services/taskService";

export function useWorkspaceTasks(workspaceId) {
    const { showToast } = useToast();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!workspaceId) {
            setTasks([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await listTasksByWorkspace(workspaceId);

            setTasks(data ?? []);
        } catch (e) {
            console.error(e);

            const msg = e.message || "Erro ao carregar tarefas do workspace.";

            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }, [workspaceId, showToast]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        tasks,
        loading,
        error,
        reload: load,
    };
}