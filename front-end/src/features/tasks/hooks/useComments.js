import { useCallback, useEffect, useState } from "react";
import { createComment, listComments } from "../services/commentService";
import { subscribeTaskComments } from "../services/taskCommentsSocketService";

export function useComments(taskId) {

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const appendComment = useCallback((comment) => {
        setComments((prev) => {
            if (prev.some((item) => item.id === comment.id)) {
                return prev;
            }
            return [...prev, comment];
        });
    }, []);

    const load = useCallback(async () => {
        if (!taskId) {
            setComments([]);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await listComments(taskId);
            setComments(data ?? []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    async function addComment(payload) {
        try {
            setError(null);

            const created = await createComment(taskId, payload);
            appendComment(created);

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        if (!taskId) return undefined;

        const unsubscribe = subscribeTaskComments(taskId, (incomingComment) => {
            appendComment(incomingComment);
        });

        return unsubscribe;
    }, [taskId, appendComment]);

    return {
        comments,
        loading,
        error,
        addComment,
    };

}