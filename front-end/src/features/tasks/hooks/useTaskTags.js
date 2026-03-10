import { useState, useCallback, useEffect } from "react";
import { useToast } from "../../../shared/utils/useToast";

import { useWorkspaceTags } from "../../wokspace/hooks/useWorkspaceTags";
import { addTagToTask, removeTagFromTask } from "../services/taskService";

export function useTaskTags(initialTask, workspaceId) {
    const { showToast } = useToast();

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

            showToast("Tag associada com sucesso!", "success");

            return updatedTask;
        } catch (err) {
            console.error(err);

            showToast("Erro ao associar tag.", "error");

            throw err;
        } finally {
            setIsAssociating(false);
        }
    }, [task?.id, reloadTags, showToast]);

    const removeTag = useCallback(async (tagId) => {
        if (!task?.id) return;

        setIsAssociating(true);

        try {
            const updatedTask = await removeTagFromTask(task.id, tagId);

            setTask(updatedTask);

            await reloadTags();

            showToast("Tag removida com sucesso!", "success");

            return updatedTask;
        } catch (err) {
            console.error(err);

            showToast("Erro ao remover tag.", "error");

            throw err;
        } finally {
            setIsAssociating(false);
        }
    }, [task?.id, reloadTags, showToast]);

    return {
        taskWithTags: task,
        workspaceTags,
        associateTag,
        removeTag,
        loadingTags,
        isProcessing: isAssociating || creatingTag
    };
}