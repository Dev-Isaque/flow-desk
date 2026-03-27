import { useEffect, useState } from "react";
import { getProjectMembers } from "../service/projectMemberService";

export function useProjectMembersList(projectId) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        async function load() {
            setLoading(true);
            try {
                const response = await getProjectMembers(projectId);
                setMembers(Array.isArray(response?.dados) ? response.dados : []);
            } catch (e) {
                console.error("Erro ao carregar membros do projeto", e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [projectId]);

    return { members, loading };
}