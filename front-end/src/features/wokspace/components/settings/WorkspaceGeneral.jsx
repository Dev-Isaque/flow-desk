export function WorkspaceGeneral({ workspace }) {
  return (
    <div className="workspace-settings">
      <div className="card">
        <h4>Informações Gerais</h4>

        <p>{workspace?.id}</p>
      </div>
    </div>
  );
}
