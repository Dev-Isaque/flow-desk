import { apiRequest } from "../../api/apiRequest";

export const getMemberProjects = (workspaceId, memberId) => {
    return apiRequest(`/projects/workspace/${workspaceId}/member/${memberId}`, {
        method: "GET",
    });
};

export const updateProjectMemberRole = (projectId, memberId, role) => {
    return apiRequest(`/projects/${projectId}/members/${memberId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
    });
};

export const addProjectMember = (projectId, memberId, role) => {
    return apiRequest(`/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ memberId, role }),
    });
};

export const removeProjectMember = (projectId, memberId) => {
    return apiRequest(`/projects/${projectId}/members/${memberId}`, {
        method: "DELETE",
    });
};