import { apiRequest } from "../../api/apiRequest";

export const getMyProjects = (workspaceId) => {
    return apiRequest(`/projects/workspace/${workspaceId}`, {
        method: "GET",
    });
};

export const createProject = ({ workspaceId, name, description = "" }) => {
    return apiRequest("/projects/create", {
        method: "POST",
        body: JSON.stringify({
            workspaceId,
            name,
            description,
        }),
    });
};

export const updateProject = (projectId, { name, description = "" }) => {
    return apiRequest(`/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify({
            name,
            description,
        }),
    });
};

export const deleteProject = (projectId) => {
    return apiRequest(`/projects/${projectId}`, {
        method: "DELETE",
    });
};