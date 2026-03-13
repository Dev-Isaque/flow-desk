import { Input } from "../../../../shared/components/Input";

export function WorkspaceGeneral({ workspace }) {
  console.log(workspace?.id);

  return (
    <div className="workspace-settings">
      <div className="settings-card">
        <h4 className="settings-title mb-4">Informações Gerais</h4>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-md-4 col-lg-3">
            <label className="settings-label mb-2">Logo do Workspace</label>

            <div className="settings-logo-upload w-100">
              <span>512x512px recomendado</span>
            </div>
          </div>

          <div className="col-12 col-md-8 col-lg-9">
            <div className="settings-fields">
              <div className="settings-field mb-3">
                <Input
                  label="Nome do Workspace"
                  defaultValue={workspace?.name}
                />
              </div>

              <div className="settings-field">
                <Input
                  label="Descrição"
                  as="textarea"
                  rows={3}
                  defaultValue={workspace?.description}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
