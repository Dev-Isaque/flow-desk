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
    removedMemberWorkspace,
    leaveWorkspace
} from "../service/workspaceService";

export function useSharedWorkspace() {

    const { showToast } = useToast();

    const [workspaces, setWorkspaces] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const requireSuccess = (response, fallbackMessage) => {
        if (!response?.sucesso) {
            throw new Error(response?.mensagem || fallbackMessage);
        }

        return response.dados;
    };

    const fetchWorkspaces = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await listWorkspaces();
            setWorkspaces(requireSuccess(response, "Erro ao carregar os workspaces.") || []);

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError(err.message || "Erro ao carregar os workspaces.");
            showToast(err.message || "Erro ao carregar os workspaces.", "error");

        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (workspaceId) => {
        setLoading(true);
        setError("");

        try {
            const response = await listWorkspaceMembers(workspaceId);
            const membersData = requireSuccess(response, "Erro ao carregar membros.") || [];

            const rolePriority = {
                OWNER: 1,
                ADMIN: 2,
                MEMBER: 3,
                VIEWER: 4,
            };

            const sortedMembers = [...membersData].sort((a, b) => {
                const roleDiff = (rolePriority[a.role] ?? 99) - (rolePriority[b.role] ?? 99);

                if (roleDiff !== 0) return roleDiff;

                return a.name.localeCompare(b.name);
            });

            setMembers(sortedMembers);

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError(err.message || "Erro ao carregar membros.");
            showToast(err.message || "Erro ao carregar os membros da equipe.", "error");

        } finally {
            setLoading(false);
        }
    };

    const handleCreateWorkspace = async (name, color) => {
        try {
            const response = await createWorkspace(name, color, "SHARED");
            requireSuccess(response, "Erro ao criar workspace.");
            await fetchWorkspaces();

            showToast("Workspace criado com sucesso!", "success");
            return true;

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError(err.message || "Erro ao criar workspace.");
            showToast(err.message || "Erro ao criar o workspace. Tente novamente.", "error");
            return false;
        }
    };

    const handleUpdateWorkspace = async (workspaceId, data) => {
        try {
            const response = await updateWorkspace(workspaceId, data);
            requireSuccess(response, "Erro ao atualizar workspace.");

            await fetchWorkspaces();

            showToast("Workspace atualizado com sucesso!", "success");
            return true;
        } catch (err) {
            console.error("Falha na requisição:", err);
            setError(err.message || "Erro ao atualizar workspace.");
            showToast(err.message || "Erro ao atualizar o workspace. Tente novamente.", "error");
            return false;
        }
    };

    const handleDeleteWorkspace = async (workspaceId) => {
        try {
            const response = await deleteWorkspace(workspaceId);
            requireSuccess(response, "Erro ao remover workspace.");

            await fetchWorkspaces();

            showToast("Workspace removido com sucesso!", "success");
            return true;

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError(err.message || "Erro ao remover workspace.");
            showToast(err.message || "Erro ao remover o workspace. Tente novamente.", "error");
            return false;
        }
    };

    const handleAddMember = async (workspaceId, email) => {
        try {
            const response = await addMemberToWorkspace(workspaceId, email);
            requireSuccess(response, "Erro ao adicionar membro.");
            await fetchMembers(workspaceId);

            showToast("Convite enviado com sucesso!", "success");
            return true;

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError(err.message || "Erro ao enviar convite.");
            showToast(err.message || "Erro ao enviar o convite. Verifique o e-mail.", "error");
            return false;
        }
    };

    const handleUpdateMember = async (workspaceId, memberId, role) => {
        try {
            const response = await updateWorkspaceMember(workspaceId, memberId, role);
            requireSuccess(response, "Erro ao atualizar permissão do membro.");
            await fetchMembers(workspaceId);

            showToast("Permissão atualizada com sucesso!", "success");
            return true;

        } catch (err) {
            console.error("Falha na requisição:", err);
            setError(err.message || "Erro ao atualizar permissão do membro.");
            showToast(err.message || "Erro ao atualizar permissão.", "error");
            return false;
        }
    };

    const handleDeleteMember = async (workspaceId, memberId) => {
        try {
            const response = await removedMemberWorkspace(workspaceId, memberId);
            requireSuccess(response, "Erro ao remover membro.");

            setMembers((prevMembers) =>
                prevMembers.filter((member) => member.id !== memberId)
            );

            showToast("Membro removido com sucesso!", "success");
            return true;

        } catch (error) {
            console.error("Erro ao remover membro:", error);
            setError(error.message || "Erro ao remover membro.");
            showToast(
                error.message || "Não foi possível remover o membro. Verifique suas permissões.",
                "error"
            );
            return false;
        }
    };

    const handleLeaveWorkspace = async (workspaceId) => {
        try {
            const response = await leaveWorkspace(workspaceId);
            requireSuccess(response, "Erro ao sair do workspace.");

            setWorkspaces((prev) =>
                prev.filter((w) => w.id !== workspaceId)
            );

            showToast("Você saiu do workspace", "success");
            return true;

        } catch (err) {
            console.error(err);
            setError(err.message || "Erro ao sair do workspace.");
            showToast(err.message || "Erro ao sair do workspace", "error");
            return false;
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
