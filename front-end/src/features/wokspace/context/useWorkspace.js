import { useContext } from "react";
import { WorkspaceContext } from "./WorkspaceContext";

export function useWorkspace() {
    const context = useContext(WorkspaceContext);

    if (!context) {
        throw new Error("useWorkspace deve ser usado dentro do WorkspaceProvider");
    }

    return context;
}