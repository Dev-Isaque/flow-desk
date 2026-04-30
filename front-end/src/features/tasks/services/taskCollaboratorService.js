import { apiRequest } from "../../api/apiRequest";

export const getCollaborators = (taskId) => {
    return apiRequest(`/tasks/${taskId}/collaborators`, {
        method: "GET"
    });
};

export const addCollaboratorToTask = (taskId, userId, role) => {
    return apiRequest(`/tasks/${taskId}/collaborators?userId=${userId}&role=${role}`, {
        method: "POST",
    }
    );
};

export const removeCollaboratorFromTask = (taskId, userId) => {
    return apiRequest(`/tasks/${taskId}/collaborators/${userId}`, {
        method: "DELETE",
    });
};

export const transferTaskOwner = (taskId, userId) => {
    return apiRequest(`/tasks/${taskId}/collaborators/owner`, {
        method: "PATCH",
        body: JSON.stringify({ userId }),
    });
};
