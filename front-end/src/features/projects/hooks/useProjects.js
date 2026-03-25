import { useEffect, useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    getMyProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../service/projectService";

export function useProjects({ workspaceId, initialProjectId }) {

    const { showToast } = useToast();

    const [projects, setProjects] = useState([]);
    const [projectSelecionado, setProjectSelecionado] = useState(initialProjectId || "ALL");

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [savingProject, setSavingProject] = useState(false);
    const [errorProjects, setErrorProjects] = useState("");

    async function loadProjects(wsId, isAliveRef) {
        if (!wsId) return;

        if (isAliveRef?.current) {
            setLoadingProjects(true);
            setErrorProjects("");
        }

        try {
            const r = await getMyProjects(wsId);

            if (!isAliveRef?.current) return;

            if (!r?.sucesso) {

                const msg = r?.mensagem || "Não foi possível carregar os projetos";

                setProjects([]);
                setErrorProjects(msg);

                showToast(msg, "error");
                return;
            }

            setProjects(Array.isArray(r.dados) ? r.dados : []);

        } catch (err) {

            console.error(err);

            const msg = "Erro ao carregar projetos.";

            if (isAliveRef?.current) {
                setErrorProjects(msg);
            }

            showToast(msg, "error");

        } finally {
            if (isAliveRef?.current) {
                setLoadingProjects(false);
            }
        }
    }

    async function addProject({ name, description = "" }) {

        setErrorProjects("");

        const cleanName = (name || "").trim();

        if (!cleanName) {
            const msg = "Digite um nome para o projeto.";
            setErrorProjects(msg);
            showToast(msg, "error");
            return { ok: false };
        }

        if (!workspaceId) {
            const msg = "Workspace ainda não carregou.";
            setErrorProjects(msg);
            showToast(msg, "error");
            return { ok: false };
        }

        setSavingProject(true);

        try {
            const r = await createProject({
                workspaceId,
                name: cleanName,
                description
            });

            if (!r?.sucesso) {
                const msg = r?.mensagem || "Não foi possível criar o projeto";
                setErrorProjects(msg);
                showToast(msg, "error");
                return { ok: false };
            }

            if (r?.dados) {
                setProjects((prev) => [...prev, r.dados]);
                setProjectSelecionado(r.dados.id);

                showToast("Projeto criado com sucesso!", "success");

                return { ok: true, project: r.dados };
            }

            return { ok: true };

        } catch (err) {

            console.error(err);

            const msg = "Erro inesperado ao criar projeto.";

            setErrorProjects(msg);
            showToast(msg, "error");

            return { ok: false };

        } finally {
            setSavingProject(false);
        }
    }

    async function handleUpdateProject(projectId, data) {

        if (!projectId) return;

        setSavingProject(true);
        setErrorProjects("");

        try {
            const r = await updateProject(projectId, data);

            if (!r?.sucesso) {
                const msg = r?.mensagem || "Não foi possível atualizar o projeto";
                setErrorProjects(msg);
                showToast(msg, "error");
                return false;
            }

            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId
                        ? { ...p, ...data }
                        : p
                )
            );

            showToast("Projeto atualizado com sucesso!", "success");

            return true;

        } catch (err) {

            console.error(err);

            const msg = "Erro ao atualizar projeto.";

            setErrorProjects(msg);
            showToast(msg, "error");

            return false;

        } finally {
            setSavingProject(false);
        }
    }

    async function handleDeleteProject(projectId) {

        if (!projectId) return;

        setSavingProject(true);
        setErrorProjects("");

        try {
            const r = await deleteProject(projectId);

            if (!r?.sucesso) {
                const msg = r?.mensagem || "Não foi possível excluir o projeto";
                setErrorProjects(msg);
                showToast(msg, "error");
                return false;
            }

            setProjects((prev) =>
                prev.filter((p) => p.id !== projectId)
            );

            showToast("Projeto excluído com sucesso!", "success");

            return true;

        } catch (err) {

            console.error(err);

            const msg = "Erro ao excluir projeto.";

            setErrorProjects(msg);
            showToast(msg, "error");

            return false;

        } finally {
            setSavingProject(false);
        }
    }

    useEffect(() => {
        if (!workspaceId) return;

        const aliveRef = { current: true };

        loadProjects(workspaceId, aliveRef);

        return () => {
            aliveRef.current = false;
        };

    }, [workspaceId]);

    useEffect(() => {
        if (initialProjectId) {
            setProjectSelecionado(initialProjectId);
        }
    }, [initialProjectId]);

    return {
        projects,
        projectSelecionado,
        setProjectSelecionado,
        loadingProjects,
        savingProject,
        errorProjects,

        addProject,
        handleUpdateProject,
        handleDeleteProject,
    };
}