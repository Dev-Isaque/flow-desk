import { useState } from "react";
import {
    listWorkspaces,
    createWorkspace,
    addMemberToWorkspace,
    listWorkspaceMembers
} from "../service/workspaceService";

export function useSharedWorkspace() {
    const [workspaces, setWorkspaces] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchWorkspaces = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await listWorkspaces();
            setWorkspaces(response?.dados || []);
        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao carregar os workspaces.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (workspaceId) => {
        setLoading(true);
        setError("");

        try {
            const response = await listWorkspaceMembers(workspaceId);
            setMembers(response?.dados || []);
        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao carregar membros.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkspace = async (name, color) => {
        try {
            await createWorkspace(name, color, "SHARED");
            await fetchWorkspaces();
        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao criar workspace.");
        }
    };

    const handleAddMember = async (workspaceId, email) => {
        try {
            await addMemberToWorkspace(workspaceId, email);
            await fetchMembers(workspaceId);
        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao adicionar membro.");
        }
    };

    return {
        workspaces,
        members,
        loading,
        error,
        fetchWorkspaces,
        fetchMembers,
        handleCreateWorkspace,
        handleAddMember
    };
}