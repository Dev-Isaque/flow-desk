import { useEffect, useState, useCallback } from "react";
import { getTaskById, deleteTask as deleteTaskRequest } from "../services/taskService";

export function useTask(taskId) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!taskId) return;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getTaskById(taskId);
                setTask(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [taskId]);

    const deleteTask = useCallback(async () => {
        if (!taskId) return false;

        try {
            setIsDeleting(true);
            await deleteTaskRequest(taskId);
            setTask(null);
            return true;
        } catch (e) {
            setError(e.message);
            return false;
        } finally {
            setIsDeleting(false);
        }
    }, [taskId]);

    return {
        task,
        loading,
        error,
        deleteTask,
        isDeleting
    };
}