import { useCallback, useEffect, useState, useMemo } from "react";
import {
    listTaskItems,
    createTaskItem,
    setTaskItemDone,
    deleteTaskItem,
} from "../services/taskItemService";

export function useTaskItems(taskId) {
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
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    async function addItem(payload) {
        const created = await createTaskItem(taskId, payload);
        setItems((prev) => [...prev, created]);
        return created;
    }

    async function toggleDone(itemId, done) {
        const updated = await setTaskItemDone(itemId, done);
        setItems((prev) => prev.map((x) => (x.id === itemId ? updated : x)));
        return updated;
    }

    async function remove(itemId) {
        await deleteTaskItem(itemId);
        setItems((prev) => prev.filter((x) => x.id !== itemId));
    }

    const allItemsDone = useMemo(() => {
        if (!items.length) return false;
        return items.every((item) => item.done);
    }, [items]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        items, loading, error, reload: load, addItem, toggleDone, remove,
        allItemsDone,
    };
}
