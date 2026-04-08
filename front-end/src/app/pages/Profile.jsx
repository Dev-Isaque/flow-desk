import { useState, useEffect } from "react";
import { useMe } from "../../features/user/hooks/useMe";

function Profile() {
  const { user, loadingMe } = useMe();

  const [name, setName] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  if (loadingMe) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-3">Meu Perfil</h2>

      <div className="theme-card-secondary p-4" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            className="theme-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="theme-input" value={user?.email || ""} disabled />
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn-color">Salvar alterações</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
