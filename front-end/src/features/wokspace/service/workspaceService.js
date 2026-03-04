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

export const createWorkspace = (workspaceName, color, type = "SHARED") => {
    return apiRequest("/workspaces/create", {
        method: "POST",
        body: JSON.stringify({
            name: workspaceName,
            color: color,
            type: type
        }),
    });
}


export const addMemberToWorkspace = (workspaceId, memberEmail) => {
    return apiRequest("/workspaces/add-member", {
        method: "POST",
        body: JSON.stringify({
            workspaceId: workspaceId,
            emailToAdd: memberEmail
        }),
    });
}