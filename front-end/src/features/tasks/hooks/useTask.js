import { useEffect, useState, useCallback } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    getTaskById,
    createTask as createTaskRequest,
    updateTask as updateTaskRequest,
    deleteTask as deleteTaskRequest,
} from "../services/taskService";

export function useTask(taskId) {
    const { showToast } = useToast();

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
                console.error(e);

                const msg = e.message || "Erro ao carregar tarefa.";
                setError(msg);

                showToast(msg, "error");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [taskId, showToast]);

    const createTask = useCallback(async (payload) => {
        try {
            setSaving(true);
            setError(null);

            const created = await createTaskRequest(payload);

            showToast("Tarefa criada com sucesso!", "success");

            return created;
        } catch (e) {
            console.error(e);

            const msg = e.message || "Erro ao criar tarefa.";
            setError(msg);

            showToast(msg, "error");

            throw e;
        } finally {
            setSaving(false);
        }
    }, [showToast]);

    const updateTask = useCallback(async (id, payload) => {
        try {
            setSaving(true);
            setError(null);

            const updated = await updateTaskRequest(id, payload);

            setTask(updated);

            showToast("Tarefa atualizada com sucesso!", "success");

            return updated;
        } catch (e) {
            console.error(e);

            const msg = e.message || "Erro ao atualizar tarefa.";
            setError(msg);

            showToast(msg, "error");

            throw e;
        } finally {
            setSaving(false);
        }
    }, [taskId, showToast]);

    const deleteTask = useCallback(async () => {
        if (!taskId) return false;

        try {
            setIsDeleting(true);

            await deleteTaskRequest(taskId);

            setTask(null);

            showToast("Tarefa removida com sucesso!", "success");

            return true;
        } catch (e) {
            console.error(e);

            const msg = e.message || "Erro ao remover tarefa.";
            setError(msg);

            showToast(msg, "error");

            return false;
        } finally {
            setIsDeleting(false);
        }
    }, [taskId, showToast]);

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