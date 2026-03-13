import { useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

import {
    listWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
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

    const handleUpdateWorkspace = async (workspaceId, data) => {
        try {
            await updateWorkspace(workspaceId, data);

            await fetchWorkspaces();

            showToast("Workspace atualizado com sucesso!", "success");

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao atualizar workspace.");
            showToast("Erro ao atualizar o workspace. Tente novamente.", "error");
        }
    };

    const handleDeleteWorkspace = async (workspaceId) => {
        try {
            await deleteWorkspace(workspaceId);

            await fetchWorkspaces();

            showToast("Workspace removido com sucesso!", "success");

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError("Erro ao remover workspace.");
            showToast("Erro ao remover o workspace. Tente novamente.", "error");
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

    const handleLeaveWorkspace = async (workspaceId, memberId) => {
        try {
            await removedMemberWorkspace(workspaceId, memberId);

            setWorkspaces((prev) =>
                prev.filter((w) => w.id !== workspaceId)
            );

            showToast("Você saiu do workspace", "success");

        } catch (err) {
            console.error(err);
            showToast("Erro ao sair do workspace", "error");
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
        handleUpdateWorkspace,
        handleDeleteWorkspace,
        handleAddMember,
        handleUpdateMember,
        handleDeleteMember,
        handleLeaveWorkspace
    };
}