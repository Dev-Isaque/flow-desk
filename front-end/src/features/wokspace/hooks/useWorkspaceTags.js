import { useEffect, useState, useCallback } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    getWorkspaceTags,
    createWorkspaceTag,
} from "../service/workspaceService";

export function useWorkspaceTags(workspaceId) {

    const { showToast } = useToast();

    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [errorTags, setErrorTags] = useState("");
    const [creatingTag, setCreatingTag] = useState(false);

    const loadTags = useCallback(async () => {
        if (!workspaceId) return;

        setErrorTags("");
        setLoadingTags(true);

        try {
            const r = await getWorkspaceTags(workspaceId);

            if (!r?.sucesso) {
                const msg =
                    r?.mensagem || "Não foi possível carregar as tags do workspace";

                setErrorTags(msg);
                showToast(msg, "error");
                return;
            }

            setTags(r.dados || []);

        } catch (err) {

            console.error(err);

            const msg = "Erro inesperado ao carregar tags.";
            setErrorTags(msg);
            showToast(msg, "error");

        } finally {
            setLoadingTags(false);
        }
    }, [workspaceId, showToast]);

    const createTag = useCallback(
        async (tagName) => {

            if (!tagName?.trim()) return null;

            setCreatingTag(true);
            setErrorTags("");

            try {
                const r = await createWorkspaceTag(workspaceId, tagName.trim());

                if (!r?.sucesso) {

                    const msg = r?.mensagem || "Não foi possível criar a tag.";

                    setErrorTags(msg);
                    showToast(msg, "error");

                    return null;
                }

                const newTag = r.dados;

                setTags((prev) => [...prev, newTag]);

                showToast("Tag criada com sucesso!", "success");

                return newTag;

            } catch (err) {

                console.error(err);

                const msg = "Erro inesperado ao criar tag.";

                setErrorTags(msg);
                showToast(msg, "error");

                return null;

            } finally {
                setCreatingTag(false);
            }
        },
        [workspaceId, showToast]
    );

    useEffect(() => {
        if (!workspaceId) return;
        loadTags();
    }, [workspaceId, loadTags]);

    return {
        tags,
        loadingTags,
        errorTags,
        createTag,
        creatingTag,
        reloadTags: loadTags,
    };
}