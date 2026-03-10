import { useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    listWorkspaces,
    createWorkspace,
    addMemberToWorkspace,
    listWorkspaceMembers,
    updateWorkspaceMember,
    removedMemberWorkspace
} from "../service/workspaceService";

export function useSharedWorkspace() {

    const { showToast } = useToast();

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
            showToast("Erro ao carregar os workspaces.", "error");

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
            showToast("Erro ao carregar os membros da equipe.", "error");

        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkspace = async (name, color) => {
        try {
            await createWorkspace(name, color, "SHARED");
            await fetchWorkspaces();

            showToast("Workspace criado com sucesso!", "success");

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao criar workspace.");
            showToast("Erro ao criar o workspace. Tente novamente.", "error");
        }
    };

    const handleAddMember = async (workspaceId, email) => {
        try {
            await addMemberToWorkspace(workspaceId, email);
            await fetchMembers(workspaceId);

            showToast("Membro adicionado com sucesso!", "success");

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao adicionar membro.");
            showToast("Erro ao adicionar o membro. Verifique o e-mail.", "error");
        }
    };

    const handleUpdateMember = async (workspaceId, memberId, role) => {
        try {
            await updateWorkspaceMember(workspaceId, memberId, role);
            await fetchMembers(workspaceId);

            showToast("Permissão atualizada com sucesso!", "success");

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao atualizar permissão do membro.");
            showToast("Erro ao atualizar permissão.", "error");
        }
    };

    const handleDeleteMember = async (workspaceId, memberId) => {
        const confirmDelete = window.confirm(
            "Tem certeza que deseja remover este membro do workspace?"
        );

        if (!confirmDelete) return;

        try {
            await removedMemberWorkspace(workspaceId, memberId);

            setMembers((prevMembers) =>
                prevMembers.filter((member) => member.id !== memberId)
            );

            showToast("Membro removido com sucesso!", "success");

        } catch (error) {
            console.error("Erro ao remover membro:", error);
            showToast(
                "Não foi possível remover o membro. Verifique suas permissões.",
                "error"
            );
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
        handleAddMember,
        handleUpdateMember,
        handleDeleteMember
    };
}