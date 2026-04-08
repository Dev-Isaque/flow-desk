import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Spinner } from "../../../shared/components/Spinner";
import { AuthLayout } from "../../../app/layouts/AuthLayout";

import { useUser } from "../../user/hooks/useUser";
import { useState } from "react";
import { useToast } from "../../../shared/utils/useToast";

export function Register() {
  const { registerUser, user, setUser, photoFile, setPhotoFile } = useUser();
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setMensagem("Apenas arquivos JPG e PNG são permitidos");
      return;
    }
    setMensagem("");
    setPhotoFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");

    if (!user?.email?.trim() || !user?.password?.trim()) {
      setMensagem("Preencha email e senha.");
      return;
    }

    setLoading(true);

    const r = await registerUser();

    setLoading(false);

    if (!r.sucesso) {
      setMensagem(r.mensagem);
      showToast(r.mensagem, "error");
      return;
    }

    showToast("Usuário cadastrado com sucesso!", "success");
  }

  return (
    <AuthLayout title="Registre-se">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="auth-inputs">
          <Input
            label="Nome"
            type="text"
            name="name"
            placeholder="Digite seu nome"
            value={user?.name || ""}
            onChange={handleChange}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Digite seu email"
            value={user?.email || ""}
            onChange={handleChange}
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="Digite sua senha"
            value={user?.password || ""}
            onChange={handleChange}
          />

          <Input
            label="Confirmar senha"
            type="password"
            name="password_confirm"
            placeholder="Confirme sua senha"
            value={user?.password_confirm || ""}
            onChange={handleChange}
          />

          <div className="auth-input">
            <label>Foto de perfil (JPG ou PNG)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Já tem conta? <Link to="/login">Entre aqui</Link>
          </p>
        </div>

        <Button type="submit" className="auth-btn" disabled={loading}>
          {loading ? <Spinner /> : "Registrar"}
        </Button>

        {mensagem && <p className="auth-error">{mensagem}</p>}
      </form>
    </AuthLayout>
  );
}

export default Register;
