import { WorkspaceContext } from "./WorkspaceContext";
import { useWorkspaceTags } from "../hooks/useWorkspaceTags";
import { useSharedWorkspace } from "../hooks/useSharedWorkspace";

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
