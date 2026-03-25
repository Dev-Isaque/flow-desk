import { WorkspaceContext } from "./WorkspaceContext";
import { useWorkspaceTags } from "../hooks/useWorkspaceTags";
import { useSharedWorkspace } from "../hooks/useSharedWorkspace";
import {} from "../../projects/hooks/useProjectMembers";
import { useProjects } from "../../projects/hooks/useProjects";

export function WorkspaceProvider({ workspaceId, workspace, children }) {
  const {
    members,
    fetchMembers,
    handleUpdateWorkspace,
    handleDeleteWorkspace,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
  } = useSharedWorkspace();

  const {
    tags,
    loadingTags,
    createTag,
    updateTag,
    deleteTag,
    creatingTag,
    updatingTag,
    deletingTag,
    reloadTags,
  } = useWorkspaceTags(workspaceId);

  const {
    projects,
    loadingProjects,
    savingProject,
    addProject,
    handleUpdateProject,
    handleDeleteProject,
  } = useProjects({ workspaceId });

  const value = {
    workspaceId,
    workspace,
    workspaceRole: workspace?.role,

    members,
    fetchMembers,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,

    handleUpdateWorkspace,
    handleDeleteWorkspace,

    projects,
    loadingProjects,
    savingProject,
    addProject,
    handleUpdateProject,
    handleDeleteProject,

    tags,
    loadingTags,
    createTag,
    updateTag,
    deleteTag,
    creatingTag,
    updatingTag,
    deletingTag,
    reloadTags,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
