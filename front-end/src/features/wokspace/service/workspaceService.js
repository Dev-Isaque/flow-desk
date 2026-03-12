import { apiRequest } from "../../api/apiRequest";

export const getPersonalWorkspace = () => {
    return apiRequest("/workspaces/personal", { method: "GET" });
};

export const listWorkspaces = () => {
    return apiRequest("/workspaces", { method: "GET" });
};

export const getWorkspaceTags = (workspaceId) => {
    return apiRequest(`/workspace/${workspaceId}/tags`, { method: "GET" });
};

export const createWorkspaceTag = (workspaceId, tagName) => {
    return apiRequest(`/workspace/${workspaceId}/tags`, {
        method: "POST",
        body: JSON.stringify({ name: tagName }),
    });
};

export const updateWorkspaceTag = (workspaceId, tagId, data) => {
    return apiRequest(`/workspace/${workspaceId}/tags/${tagId}`, {
        method: "PUT",
        body: JSON.stringify({
            name: data.name,
        }),
    });
};

export const deleteWorkspaceTag = (workspaceId, tagId) => {
    return apiRequest(`/workspace/${workspaceId}/tags/${tagId}`, {
        method: "DELETE",
    });
};

export const createWorkspace = (workspaceName, color, type = "SHARED") => {
    return apiRequest("/workspaces/create", {
        method: "POST",
        body: JSON.stringify({
            name: workspaceName,
            color: color,
            type: type,
        }),
    });
};

export const addMemberToWorkspace = (workspaceId, memberEmail) => {
    return apiRequest(`/workspaces/${workspaceId}/members`, {
        method: "POST",
        body: JSON.stringify({
            emailToAdd: memberEmail,
        }),
    });
};

export const updateWorkspaceMember = (workspaceId, memberId, role) => {
    return apiRequest(`/workspaces/${workspaceId}/members/${memberId}`, {
        method: "PATCH",
        body: JSON.stringify({
            role: role,
        }),
    });
};

export const removedMemberWorkspace = (workspaceId, memberId) => {
    return apiRequest(`/workspaces/${workspaceId}/members/${memberId}`, {
        method: "DELETE",
    });
};

export const listWorkspaceMembers = (workspaceId) => {
    return apiRequest(`/workspaces/${workspaceId}/members`, {
        method: "GET",
    });
};