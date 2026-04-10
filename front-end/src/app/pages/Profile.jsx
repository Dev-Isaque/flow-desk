import React, { useState, useEffect } from "react";
import { useUser } from "../../features/user/hooks/useUser";
import { useMe } from "../../features/user/hooks/useMe";
import { useToast } from "../../shared/utils/useToast";

import User from "../../shared/assets/images/user.png";

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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">
            Carregando seu perfil...
          </div>
        </div>
      </div>
    );
  }

  const needsCurrentPassword = currentUser?.email !== user.email || newPassword;

  return (
    <div className="profile-card">
      <header className="profile-header">
        <h1 className="profile-title">Configurações de Perfil</h1>
        <p className="profile-subtitle">
          Gerencie suas informações pessoais e segurança
        </p>
      </header>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            {currentUser?.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt="Foto de perfil"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar flex items-center justify-center bg-gray-100 text-gray-400">
                <img
                  src={User}
                  alt="Foto de perfil"
                  className="profile-avatar"
                />
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="profile-avatar-edit"
              title="Editar foto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </label>
          </div>

          <div className="text-center">
            <label
              htmlFor="photo-upload"
              className="profile-change-photo cursor-pointer"
            >
              {photoFile ? "Alterar seleção" : "Trocar imagem"}
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
              <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 py-1 px-3 rounded-full inline-block">
                Selecionado: {photoFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Campos de Dados Pessoais */}
        <div className="input-group">
          <label className="profile-label">Nome Completo</label>
          <input
            type="text"
            className="profile-input"
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            disabled={loading}
            placeholder="Ex: João Silva"
          />
        </div>

        <div className="input-group">
          <label className="profile-label">E-mail</label>
          <input
            type="email"
            className="profile-input"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            disabled={loading}
            placeholder="seu@email.com"
          />
        </div>

        {/* Seção de Senha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="profile-label">Nova Senha</label>
            <input
              type="password"
              className="profile-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              placeholder="Deixe em branco para manter"
            />
          </div>

          {newPassword && (
            <div className="input-group">
              <label className="profile-label">Confirmar Senha</label>
              <input
                type="password"
                className="profile-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                placeholder="Repita a nova senha"
              />
            </div>
          )}
        </div>

        <hr className="my-2 border-gray-100" />

        <div className="input-group">
          <label className="profile-label">
            Senha Atual
            {needsCurrentPassword && (
              <span className="profile-label-required">
                * Necessária para alterações sensíveis
              </span>
            )}
          </label>
          <input
            type="password"
            className="profile-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            placeholder="Confirme sua identidade"
          />
        </div>

        <button type="submit" className="profile-submit" disabled={loading}>
          {loading ? "Salvando alterações..." : "Atualizar Perfil"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
