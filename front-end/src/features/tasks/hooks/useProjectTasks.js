import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    listTasksByProject,
    listTasksByWorkspace,
} from "../services/taskService";

export function useProjectTasks(projectId, workspaceId) {
    const { showToast } = useToast();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!workspaceId && (!projectId || projectId === "ALL")) {
            setTasks([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let data;

            if (!projectId || projectId === "ALL") {
                data = await listTasksByWorkspace(workspaceId);
            } else {
                data = await listTasksByProject(projectId);
            }

            setTasks(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            const msg = e.message || "Erro ao buscar tarefas.";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }, [projectId, workspaceId, showToast]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        setTasks([]);
    }, [projectId, workspaceId]);

    return { tasks, loading, error, reload: load, setTasks };
}