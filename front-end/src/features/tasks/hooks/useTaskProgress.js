import { useEffect, useState, useCallback } from "react";
import { useToast } from "../../../shared/utils/useToast";

import { getTaskProgress } from "../services/taskService";

export function useTaskProgress(taskId) {
    const { showToast } = useToast();

    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!taskId) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getTaskProgress(taskId);

            setProgress(data);
        } catch (err) {
            console.error(err);

            const msg = err.message || "Erro ao carregar progresso da tarefa.";

            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }, [taskId, showToast]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        progress,
        loading,
        error,
        reload: load,
    };
}