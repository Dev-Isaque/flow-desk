// useProjectMembers.js
import { useEffect, useState } from "react";
import {
    getMemberProjects,
    updateProjectMemberRole,
    addProjectMember,
    removeProjectMember,
} from "../service/projectMemberService";

export function useProjectMembers(member, workspaceId) {
    const [memberProjects, setMemberProjects] = useState({});
    const [originalProjects, setOriginalProjects] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!member || !workspaceId) return;

        async function load() {
            setLoading(true);
            try {
                const response = await getMemberProjects(workspaceId, member.userId);
                const projects = Array.isArray(response?.dados) ? response.dados : [];

                const map = {};
                projects.forEach((p) => {
                    if (p.role) map[p.id] = p.role;
                });

                setMemberProjects(map);
                setOriginalProjects(map);
            } catch (e) {
                console.error("Erro ao carregar permissões", e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [member, workspaceId]);

    const changeRole = (projectId, role) => {
        setMemberProjects((prev) => ({ ...prev, [projectId]: role }));
    };

    const grantAccess = (projectId, role = "VIEWER") => {
        setMemberProjects((prev) => ({ ...prev, [projectId]: role }));
    };

    const removeAccess = (projectId) => {
        setMemberProjects((prev) => {
            const updated = { ...prev };
            delete updated[projectId];
            return updated;
        });
    };

    const save = async () => {
        setSaving(true);
        try {
            for (const projectId in memberProjects) {
                const role = memberProjects[projectId];
                const existed = originalProjects.hasOwnProperty(projectId);

                if (existed) {
                    if (originalProjects[projectId] !== role) {
                        await updateProjectMemberRole(projectId, member.userId, role);
                    }
                } else {
                    await addProjectMember(projectId, member.userId, role);
                }
            }

            for (const projectId in originalProjects) {
                if (!memberProjects.hasOwnProperty(projectId)) {
                    await removeProjectMember(projectId, member.userId);
                }
            }

            setOriginalProjects({ ...memberProjects });
        } catch (e) {
            console.error("Erro ao salvar permissões", e);
        } finally {
            setSaving(false);
        }
    };

    return {
        memberProjects,
        loading,
        saving,
        changeRole,
        grantAccess,
        removeAccess,
        save,
    };
}