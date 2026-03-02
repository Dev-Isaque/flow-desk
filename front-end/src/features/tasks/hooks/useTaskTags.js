import { useState, useCallback, useEffect } from "react";
import { useWorkspaceTags } from "../../wokspace/hooks/useWorkspaceTags";
import { addTagToTask, removeTagFromTask } from "../services/taskService";

export function useTaskTags(initialTask, workspaceId) {
    const [task, setTask] = useState(initialTask);

    useEffect(() => {
        setTask(initialTask);
    }, [initialTask]);

    const {
        tags: workspaceTags,
        reloadTags,
        loadingTags,
        creatingTag
    } = useWorkspaceTags(workspaceId);

    const [isAssociating, setIsAssociating] = useState(false);

    const associateTag = useCallback(async (tagName) => {
        if (!tagName?.trim() || !task?.id) return;

        setIsAssociating(true);
        try {
            const updatedTask = await addTagToTask(task.id, tagName.trim());

            setTask(updatedTask);

            await reloadTags();

            return updatedTask;
        } catch (err) {
            console.error("Erro ao associar tag:", err);
            throw err;
        } finally {
            setIsAssociating(false);
        }
    }, [task?.id, reloadTags]);

    const removeTag = useCallback(async (tagId) => {
        if (!task?.id) return;

        setIsAssociating(true);
        try {
            const updatedTask = await removeTagFromTask(task.id, tagId);

            setTask(updatedTask);
            await reloadTags();

            return updatedTask;
        } catch (err) {
            console.error("Erro ao remover tag:", err);
            throw err;
        } finally {
            setIsAssociating(false);
        }
    }, [task?.id, reloadTags]);

    return {
        taskWithTags: task,
        workspaceTags,
        associateTag,
        removeTag,
        loadingTags,
        isProcessing: isAssociating || creatingTag
    };
}