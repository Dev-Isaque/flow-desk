import { useEffect, useState } from "react";
import { getMyProjects, createProject } from "../service/projectService";

export function useProjects({ workspaceId, initialProjectId }) {

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
                setProjects([]);
                setErrorProjects(r?.mensagem || "Não foi possível carregar os projetos");
                return;
            }

            setProjects(Array.isArray(r.dados) ? r.dados : []);
        } finally {
            if (isAliveRef?.current) setLoadingProjects(false);
        }
    }

    async function addProject({ name, description = "" }) {
        setErrorProjects("");

        const cleanName = (name || "").trim();
        if (!cleanName) {
            setErrorProjects("Digite um nome para o projeto.");
            return { ok: false };
        }

        if (!workspaceId) {
            setErrorProjects("Workspace ainda não carregou.");
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
                setErrorProjects(r?.mensagem || "Não foi possível criar o projeto");
                return { ok: false };
            }

            if (r?.dados) {
                setProjects((prev) => [...prev, r.dados]);
                setProjectSelecionado(r.dados.id);
                return { ok: true, project: r.dados };
            }

            return { ok: true };
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
    };
}