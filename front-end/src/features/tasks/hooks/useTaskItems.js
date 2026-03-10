import { useCallback, useEffect, useState, useMemo } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    listTaskItems,
    createTaskItem,
    setTaskItemDone,
    deleteTaskItem,
} from "../services/taskItemService";

export function useTaskItems(taskId) {
    const { showToast } = useToast();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!taskId) {
            setItems([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await listTaskItems(taskId);

            setItems(data ?? []);
        } catch (e) {
            console.error(e);

            const msg = e.message || "Erro ao carregar checklist.";

            setError(msg);

            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }, [taskId, showToast]);

    async function addItem(payload) {
        try {
            const created = await createTaskItem(taskId, payload);

            setItems((prev) => [...prev, created]);

            showToast("Item criado com sucesso!", "success");

            return created;
        } catch (e) {
            console.error(e);

            showToast("Erro ao criar item.", "error");
        }
    }

    async function toggleDone(itemId, done) {
        try {
            const updated = await setTaskItemDone(itemId, done);

            setItems((prev) =>
                prev.map((x) => (x.id === itemId ? updated : x))
            );

            return updated;
        } catch (e) {
            console.error(e);

            showToast("Erro ao atualizar item.", "error");
        }
    }

    async function remove(itemId) {
        try {
            await deleteTaskItem(itemId);

            setItems((prev) => prev.filter((x) => x.id !== itemId));

            showToast("Item removido.", "success");
        } catch (e) {
            console.error(e);

            showToast("Erro ao remover item.", "error");
        }
    }

    const allItemsDone = useMemo(() => {
        if (!items.length) return false;
        return items.every((item) => item.done);
    }, [items]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        items,
        loading,
        error,
        reload: load,
        addItem,
        toggleDone,
        remove,
        allItemsDone,
    };
}