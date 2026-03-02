import { useEffect, useState, useCallback } from "react";
import {
    getTaskById,
    createTask as createTaskRequest,
    updateTask as updateTaskRequest,
    deleteTask as deleteTaskRequest,
} from "../services/taskService";

export function useTask(taskId) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
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

    const createTask = useCallback(async (payload) => {
        try {
            setSaving(true);
            setError(null);

            const created = await createTaskRequest(payload);

            return created;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setSaving(false);
        }
    }, []);
    const updateTask = useCallback(async (payload) => {
        if (!taskId) return null;

        try {
            setSaving(true);
            setError(null);

            const updated = await updateTaskRequest(taskId, payload);

            setTask(updated);

            return updated;
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setSaving(false);
        }
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
        saving,
        error,
        deleteTask,
        createTask,
        updateTask,
        isDeleting,
    };
}