import React, { useState, useEffect } from "react";
import { useUser } from "../../features/user/hooks/useUser";
import { useMe } from "../../features/user/hooks/useMe";
import { useToast } from "../../shared/utils/useToast";

function Profile() {
  const { showToast } = useToast();
  const { user: currentUser, loadingMe } = useMe();
  const { updateUser, user, setUser, photoFile, setPhotoFile, loading } =
    useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasNameChange = user.name !== currentUser?.name;
    const hasEmailChange = user.email !== currentUser?.email;
    const hasPhotoChange = photoFile !== null;
    const hasPasswordChange = newPassword !== "";

    if (
      !hasNameChange &&
      !hasEmailChange &&
      !hasPhotoChange &&
      !hasPasswordChange
    ) {
      showToast("Nenhuma alteração detectada", "info");
      return;
    }

    if ((hasEmailChange || hasPasswordChange) && !currentPassword) {
      showToast(
        "A senha atual é obrigatória para alterar email ou senha",
        "error",
      );
      return;
    }

    if (hasPasswordChange && newPassword !== confirmPassword) {
      showToast("As senhas não conferem", "error");
      return;
    }

    const payload = {};

    if (hasNameChange) {
      payload.name = user.name;
    }

    if (hasEmailChange) {
      payload.email = user.email;
      payload.currentPassword = currentPassword;
    }

    if (hasPasswordChange) {
      payload.password = newPassword;
      payload.password_confirm = confirmPassword;
      payload.currentPassword = currentPassword;
    }

    if (currentUser?.id) {
      const result = await updateUser(currentUser.id, payload);

      if (!result?.sucesso) {
        showToast(result?.mensagem || "Erro ao atualizar", "error");
        return;
      }

      showToast("Perfil atualizado com sucesso!", "success");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPhotoFile(null);

      window.location.reload();
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        showToast("Apenas arquivos JPG e PNG são permitidos", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("A imagem deve ter no máximo 5MB", "error");
        return;
      }

      setPhotoFile(file);
    }
  };

  if (loadingMe) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 profile-card">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-4 mb-2">
          <div className="profile-avatar-wrapper">
            {currentUser?.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt="Foto de perfil"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar bg-gray-200 flex items-center justify-center text-gray-500">
                <span className="text-3xl">👤</span>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="photo-upload"
              className="profile-change-photo font-medium cursor-pointer"
            >
              Alterar foto de perfil
            </label>
            <input
              id="photo-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePhotoChange}
              disabled={loading}
            />
            {photoFile && (
              <p className="text-sm text-gray-600 mt-1">
                Nova: {photoFile.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block profile-label mb-1">Nome</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 profile-input"
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            disabled={loading}
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label className="block profile-label mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 profile-input"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            disabled={loading}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block profile-label mb-1">Nova Senha</label>
          <input
            type="password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 profile-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            placeholder="●●●●●"
          />
        </div>

        {newPassword && (
          <div>
            <label className="block profile-label mb-1">Confirmar Senha</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 profile-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              placeholder="●●●●●"
            />
          </div>
        )}

        <div>
          <label className="block profile-label mb-1">
            Senha Atual{" "}
            {currentUser?.email !== user.email || newPassword
              ? "(obrigatória)"
              : "(opcional)"}
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 profile-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            placeholder="●●●●●"
          />
        </div>

        <button
          type="submit"
          className="w-full profile-submit bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
